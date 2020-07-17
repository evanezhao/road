<template>
	<view class="uni-page-body height100">
		<map v-show="showMap" id="mymap" class="height100" show-compass="true" :longitude="log" :latitude="lat" show-location
		 :markers="markers" :polyline="polyline" :include-points="includePoints">
			<view @click="toggleSelect($event)" :class="selectClass" tabindex="1" style="overflow:visible;">在线人员({{selectedUser?selectedUser.userName :'全部'}})
				<view class="dropdown">
					<view class="li">
						<view class="a" id="viewAllUser">全部</view>
					</view>
					<view class="li" v-for="user in userArr" v-key="user.userId">
						<view class="a user" :id="user.userId">
							<image :src="user.userLogo" class="image"></image>{{user.userName}}
						</view>
					</view>
				</view>
			</view>
		</map>
	</view>
</template>

<script>
	//在地图上查看位置信息
	//需要在上一级页面注册事件 uni.$once('getMarks'
	import {
		computeAngle,
		timestampToTime,
		encodeUnicode
	} from '../common/util.js';

	export default {
		data() {
			return {
				log: 113.05679793634032,
				lat: 28.16802509683876,
				inteval: null,
				showMap: false,
				selectClass: 'wrapper-dropdown-5',
				selectedUser: null,
				includePoints: [], //缩放视野以包含所有给定的坐标点				
				userArr: [], //当前在线的用户列表
				markers: [], //当前在线的用户标记点
				mapContext: {}
			}
		},
		onShow() {
			this.getData();
		},
		onHide() {
			clearInterval(this.inteval);
		},
		onLoad(param) {
			let marks = [],
				self = this;
			uni.showLoading({
				title: '加载中'
			});
			self.mapContext = uni.createMapContext('mymap', self);
		},
		methods: {
			toggleSelect(evt) {				
				let uid = evt.target.id.replace('image', '');
				this.selectClass = `wrapper-dropdown-5 ${this.selectClass.indexOf('active')===-1?'active':''}`;
				if (!uid) {
					return;
				} else if (uid === 'viewAllUser') {
					this.selectedUser = null;

					//缩放视野，以便在地图视野中看到所有在线用户的位置点
					let points = this.markers.map(function(marker) {
						let {
							id,
							longitude,
							latitude
						} = marker,
						point = {
							id,
							longitude,
							latitude
						};
						return point;
					});
					this.includePoints = points;
				} else {
					for (let i = 0, len = this.userArr.length, user; i < len; i++) {
						user = this.userArr[i];
						if (uid === user.userId) {
							this.selectedUser = user;

							let long = this.markers[i].longitude;
							let lat = this.markers[i].latitude;							
							this.mapContext.moveToLocation({
								longitude: long,
								latitude: lat
							});
							break;
						}
					}
				}
			},
			getData() {
				const self = this,
					fun = () => {
						self.$req({
							url: self.$apis.user.getPostion,
							method: 'GET',
							data: {
								type: '1'
							},
							success: (res) => {
								let userArr, points = [],
									markers;
								if (res.data.status === 200) {
									userArr = res.data.data;

									if (userArr && userArr.length) {
										(function() {
											let deleteUserIndex = [];
											//将下线的用户从地图上删除
											self.userArr.forEach(function(user, index) {
												//Object.assign(initStorageData, userstoredata || {});


												for (let i = 0, len = userArr.length, userId; i < len; i++) {
													userId = userArr[i].user.split(':')[0];
													if (userId === user.userId) {
														//当前地图上的用户未下线，则继续保持;
														return true;
													}
												}
												deleteUserIndex.push(index);
											});

											deleteUserIndex.forEach(function(index) {
												self.userArr.splice(index, 1);
												self.markers.splice(index, 1);
												//self.includePoints.splice(index, 1);
											});
										}());

										//更新用户的新位置信息
										userArr.forEach((item, index) => {
											let userInfo = item.user.split(':'),
												userId = userInfo[0],
												userName = userInfo[1],
												userLogo = `${userInfo[2]}:${userInfo.length>3?userInfo[3]:''}`.replace(/\/\d+$/, '/46');
											if (!item.pos || !item.pos.length) {
												self.showMap = true;
												return true;
											}

											let posData = item.pos[0].split('|'),
												latitude = +posData[1],
												longitude = +posData[2],

												prevPosData = item.pos.length > 1 ? item.pos[1].split('|') : null,
												prevLatitude = prevPosData ? +prevPosData[1] : 0,
												prevLongitude = prevPosData ? +prevPosData[2] : 0,

												time = +posData[0];

											let point = {
												id: userId,
												longitude,
												latitude
											};

											let timespan = timestampToTime(time),
												mark = {
													uid: userId,
													iconPath: "/static/pos1.png",
													id: 0,
													longitude,
													latitude,
													label: {
														content: userName,
														x: 3,
														y: -10,
														anchorX: 3, //微信已废弃X,Y
														anchorY: -10,
														color: '#55aaff',
														borderWidth: 1,
														borderColor: '#55aaff',
														borderRadius:5,
														padding: 1,
														textAlign: 'left'
													},
													rotate: prevPosData ? computeAngle(prevLatitude, prevLongitude, latitude, longitude) : 0,
													title: `${userName} 最后位置更新于${timespan}`,
													width: 16,
													height: 16
												};


											(function() {
												let i = 0,
													len = self.markers.length;

												for (let _mark; i < len; i++) {
													_mark = self.markers[i];
													//更新用户位置 
													if (_mark.uid === mark.uid) {
														mark.id = i;
														Object.assign(_mark, mark);
														break;
													}
												}
												//当新用户上线时，增加标记点，用户列表中增加一项
												if (i === len) {
													mark.id = self.markers.length;
													self.markers.push(mark);
													self.userArr.push({
														userId,
														userName,
														userLogo
													});
													points.push(point);
												}
											}());


										});
										//includePoints 只初始化一次，避免用户在操作地图时，地图自动移动
										if (!self.includePoints.length) {
											self.includePoints = points;
										}
									}
								}
								self.showMap = true;
								uni.hideLoading();
							}
						});
					};
				fun();
				self.inteval = setInterval(fun, 3000);
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}

	.height100 {
		width: 100%;
		height: 100%;
	}

	/* DEMO 5 */

	.wrapper-dropdown-5 {
		/* Size & position */
		position: relative;
		width: 200px;
		margin: 0 auto;
		padding: 12px 15px;

		/* Styles */
		background: #fff;
		border-radius: 5px;
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
		cursor: pointer;
		outline: none;
		-webkit-transition: all 0.3s ease-out;
		-moz-transition: all 0.3s ease-out;
		-ms-transition: all 0.3s ease-out;
		-o-transition: all 0.3s ease-out;
		transition: all 0.3s ease-out;
	}

	.wrapper-dropdown-5:after {
		/* Little arrow */
		content: "";
		width: 0;
		height: 0;
		position: absolute;
		top: 50%;
		right: 15px;
		margin-top: -3px;
		border-width: 6px 6px 0 6px;
		border-style: solid;
		border-color: #4cbeff transparent;
	}

	.wrapper-dropdown-5 .dropdown {
		/* Size & position */
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;

		/* Styles */
		background: #fff;
		border-radius: 0 0 5px 5px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-top: none;
		border-bottom: none;
		list-style: none;
		-webkit-transition: all 0.3s ease-out;
		-moz-transition: all 0.3s ease-out;
		-ms-transition: all 0.3s ease-out;
		-o-transition: all 0.3s ease-out;
		transition: all 0.3s ease-out;

		/* Hiding */
		max-height: 0;
		overflow: hidden;
	}

	.wrapper-dropdown-5 .dropdown .li {
		padding: 0 10px;
	}

	.wrapper-dropdown-5 .dropdown .li .a {
		display: block;
		text-decoration: none;
		color: #333;
		padding: 10px 0;
		transition: all 0.3s ease-out;
		border-bottom: 1px solid #e6e8ea;
	}

	.wrapper-dropdown-5 .dropdown .user {
		height: 48upx;
		line-height: 48upx;
	}

	.wrapper-dropdown-5 .dropdown .user .image {	
		width: 15px;
		height: 15px;
		margin-right: 10upx;
	}

	.wrapper-dropdown-5 .dropdown .li:last-of-type .a {
		border: none;
	}

	.wrapper-dropdown-5 .dropdown .li .i {
		margin-right: 5px;
		color: inherit;
		vertical-align: middle;
	}

	/* Hover state */

	.wrapper-dropdown-5 .dropdown .li:hover .a {
		color: #57a9d9;
	}

	/* Active state */

	.wrapper-dropdown-5.active {
		border-radius: 5px 5px 0 0;
		background: #4cbeff;
		box-shadow: none;
		border-bottom: none;
		color: white;
	}

	.wrapper-dropdown-5.active:after {
		border-color: #82d1ff transparent;
	}

	.wrapper-dropdown-5.active .dropdown {
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		max-height: 400px;
	}
</style>
