/*
 * @Author: zyg 834737857@qq.com
 * @Date: 2023-02-24 15:00:52
 * @LastEditors: your name
 * @LastEditTime: 2023-10-30 21:28:09
 * @FilePath: \cesium_vue3\src\components\drawpointpolylinepolygon\utils\DrawTool.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ElMessage, ElMessageBox } from 'element-plus'

let needlePoint = require('@/assets/image/map/selectimagebig.png');

let flagPoint = require('@/assets/image/map/selectimagepoint.png');
let PositionPoint = require('@/assets/image/map/selectimageqz.png');

class DrawRectangle {
    constructor(arg) {
        this.viewer = arg.viewer;
        this.callback = arg.callback;
        this.floatingPoint = null;//标识点
        this._rectangle = null; //活动矩形
        this._rectangleLast = null; //最后一个矩形
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_rectangle = [];  //脏数据
        this._rectangleData = null; //用于构造矩形数据
    }

    //返回最后图形
    get line() {
        return this._rectangleLast;
    }

    //返回矩形数据
    getData() {

        let rectangleData = this._rectangleData;
        const removeDuplicateObj = (rectangleData) => {
            let obj = {};
            rectangleData = rectangleData.reduce((newArr, next) => {
                obj[next.x] ? "" : (obj[next.x] = true && newArr.push(next));
                return newArr;
            }, []);
            return rectangleData;
        };
        return removeDuplicateObj(rectangleData);
    }

    getDatawkt() {
        let wktarray = [];
        let lng = [], lat = [];
        var rectangleEndData = this.getData();
        // console.log(rectangleEndData)
        var areaArrayPoint = [];
        for (let index = 0; index < rectangleEndData.length; index++) {
            const element = rectangleEndData[index];
            let e = this.gobelTolatlng(element)
            lng.push(e[0]);
            lat.push(e[1]);
            wktarray.push(e);
        }
        let minlng = Math.min(...lng);
        let maxlng = Math.max(...lng);
        let minlat = Math.min(...lat);
        let maxlat = Math.max(...lat);
        var wkt = `POLYGON((${minlng} ${maxlat},${maxlng} ${maxlat},${maxlng} ${minlat},${minlng} ${minlat},${minlng} ${maxlat}))`;
        let arraywktpoint = [
            [minlng, maxlat],//1
            [maxlng, maxlat],//2
            [maxlng, minlat],//3
            [minlng, minlat],//4
            [minlng, maxlat]//5
        ]
        arraywktpoint.forEach(element => {
            let cartesian = Cesium.Cartesian3.fromDegrees(...element)
            areaArrayPoint.push(cartesian);
        });

        let area = this.getArea(areaArrayPoint)
        // this.aleartElMessageBox(area);
        return { arraywktpoint, wkt, area };

    }

    gobelTolatlng(Cartesian3) {
        if (Cartesian3)
            var cartesian3 = new Cesium.Cartesian3(Cartesian3.x, Cartesian3.y, Cartesian3.z);

        var cartograhphic = Cesium.Cartographic.fromCartesian(cartesian3)

        var lat = Cesium.Math.toDegrees(cartograhphic.latitude);

        var lng = Cesium.Math.toDegrees(cartograhphic.longitude);
        return [lng, lat];
    }
    //加载
    loadRectangle(data) {
        var $this = this;
        var shape = this.viewer.entities.add({
            name: "rectangle",
            rectangle: {
                coordinates: Cesium.Rectangle.fromCartesianArray(data),
                material: Cesium.Color.RED.withAlpha(0.5)
            }
        });
        $this._entities_rectangle.push(shape);
        return shape;
    }
    getArea(points) {
        var res = 0;
        //拆分三角曲面

        for (var i = 0; i < points.length - 2; i++) {
            var j = (i + 1) % points.length;
            var k = (i + 2) % points.length;
            var totalAngle = this.Angle(points[i], points[j], points[k]);

            var dis_temp1 = this.distance(points[j], points[0]);
            var dis_temp2 = this.distance(points[k], points[0]);
            res += dis_temp1 * dis_temp2 * Math.sin(totalAngle) / 2;
        }
        res = Math.abs(res).toFixed(4);

        // if (res < 1000000) {
        //     res = Math.abs(res).toFixed(4) + " 平方米";
        // } else {
        //     res = Math.abs((res / 1000000.0).toFixed(4)) + " 平方公里";
        // }

        return res;

    };

    distance(point1, point2) {
        var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        return s;
    }

    /*方向*/
    Bearing(from, to) {
        from = Cesium.Cartographic.fromCartesian(from);
        to = Cesium.Cartographic.fromCartesian(to);

        var lat1 = from.latitude;
        var lon1 = from.longitude;
        var lat2 = to.latitude;
        var lon2 = to.longitude;
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度

        angle = angle * degreesPerRadian; //角度
        return angle;
    }
    /*角度*/
    Angle(p1, p2, p3) {
        var bearing21 = this.Bearing(p2, p1);
        var bearing23 = this.Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }
    //开始创建
    startCreate() {
        var $this = this;

        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        this.handler.setInputAction(function (evt) { //单机开始绘制

            //屏幕坐标转地形上坐标
            var cartesian = $this.getCatesian3FromPX(evt.position);

            if ($this._positions.length == 0) {
                $this._positions.push(cartesian.clone());
                $this.floatingPoint = $this.createPoint(cartesian);
                $this.createPoint(cartesian);// 绘制点
            }
            $this._positions.push(cartesian);
            $this.viewer.scene.forceRender();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制线
            if ($this._positions.length < 3) return;
            var cartesian = $this.getCatesian3FromPX(evt.endPosition);
            if (!Cesium.defined($this._rectangle)) {
                $this._rectangle = $this.createRectangle();
            }
            $this.floatingPoint.position.setValue(cartesian);
            if ($this._rectangle) {
                $this._positions.pop();
                $this._positions.push(cartesian);
            }
            $this.viewer.scene.forceRender();
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) {
            $this.viewer.trackedEntity = undefined;
            if (!$this._rectangle) return;
            var cartesian = $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this.createPoint(cartesian);// 绘制点
            $this._rectangleData = $this._positions.concat();
            $this.viewer.entities.remove($this._rectangle); //移除
            $this._rectangle = null;
            $this._positions = [];
            $this.floatingPoint.position.setValue(cartesian);
            var rectangle = $this.loadRectangle($this._rectangleData); //加载
            $this._entities_rectangle.push(rectangle);
            $this._rectangleLast = rectangle;
            if (typeof $this.callback == "function") {
                $this.callback(rectangle);
            }
            $this.destroy();
            $this.viewer.scene.forceRender();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return this;
    }

    //创建点
    createPoint(cartesian) {

        var $this = this;
        var point = this.viewer.entities.add({
            position: cartesian,
            point: {
                pixelSize: 10,
                color: Cesium.Color.YELLOW,
            }
        });
        $this._entities_point.push(point);
        $this.viewer.scene.forceRender();
        return point;
    }
    //创建矩形
    createRectangle() {

        var $this = this;

        var shape = this.viewer.entities.add({
            name: "rectangle",
            rectangle: {
                coordinates: new Cesium.CallbackProperty(() => {
                    if ($this.checkPositions()) {
                        var obj = Cesium.Rectangle.fromCartesianArray($this._positions);
                        return obj;
                    }

                }, false),
                material: Cesium.Color.RED.withAlpha(0.5)
            }
        });
        $this._entities_rectangle.push(shape);
        $this.viewer.scene.forceRender();
        return shape;
    }

    //销毁
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
            this.viewer.scene.forceRender();
        }
    }
    aleartElMessageBox(area) {
        if (area > 1000000)
            ElMessageBox.alert('选择范围超过100w平方m,请选择更精确的范围!', {
                // if you want to disable its autofocus
                // autofocus: false,
                confirmButtonText: 'OK',
                callback: () => {
                    this.clear();
                    return;
                },
            })
    }
    //清空实体对象
    clear() {
        this.destroy()
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        for (var i = 0; i < this._entities_rectangle.length; i++) {
            this.viewer.entities.remove(this._entities_rectangle[i]);
        }
        this.floatingPoint = null;//标识点
        this._rectangle = null; //活动矩形
        this._rectangleLast = null; //最后一个矩形
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_rectangle = [];  //脏数据
        this._rectangleData = null; //用于构造矩形数据
        this.viewer.scene.forceRender();
    }
    checkPositions() {
        let flag = true;
        for (let item of this._positions) {
            if (!item || !item.x) {
                flag = false;
                break;
            }
        }

        return flag;
    }
    getCatesian3FromPX(px) {

        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }
}


/*
 * @Author: una
 * @Date: 2022-04-06 09:21:22
 * @LastEditors: zyg 834737857@qq.com
 * @LastEditTime: 2023-02-24 17:18:42
 * @Description: 绘制
 */
/*
绘制圆
 */
class DrawCircle {
    constructor(arg) {
        this.viewer = arg.viewer;
        this.Cesium = Cesium;
        this.callback = arg.callback;
        this._cicle = null; //活动圆
        this.floatingPoint = null;
        this._cicleLast = null; //最后一个圆
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_cicle = [];  //脏数据
        this.area = null;
        this._cicleData = null; //用于构造圆形数据
    }

    get cicle() {
        return this._cicleLast;
    }

    //加载圆
    loadCicle(data) {
        var that = this;
        var position = data[0];
        var value = data;
        var r = Math.sqrt(
            Math.pow(value[0].x - value[value.length - 1].x, 2) +
            Math.pow(value[0].y - value[value.length - 1].y, 2)
        );

        let centerlatlng = this.gobelTolatlng(position);
        let arrayPositon = [centerlatlng[0], centerlatlng[1]];

        this._cicleData = this.countCircle(r, arrayPositon);
        var shape = this.viewer.entities.add({
            position: position,
            name: "circle",
            type: "circle",
            ellipse: {
                semiMinorAxis: r,
                semiMajorAxis: r,
                material: that.Cesium.Color.RED.withAlpha(0.5),
                outline: true
            }
        });
        return shape;
    }

    //返回数据
    getData() {
        return this._cicleData;
    }

    getDatawkt() {
        return { wkt: this._cicleData, area: this.area };
    }
    countCircle(t, e) {
        var r = t / (2 * Math.PI * 6371004) * 360
        let s = []
        let firstx = null, firsty = null;
        var wkt = `POLYGON((`;
        for (let i = 0; i < 360; i += 3) {
            let x = e[0] + r * Math.cos(i * Math.PI / 180)
            let y = e[1] + r * Math.sin(i * Math.PI / 180)
            if (i == 0) {
                firstx = x;
                firsty = y;
            }
            if (i == 357) {
                wkt += `${x} ${y},${firstx} ${firsty}`
                break;
            }
            wkt += `${x} ${y},`
            s.push([x, y]);
        }
        wkt += `))`;
        let area = this.getArea(t);
        this.area = area;
        // this.aleartElMessageBox(area);
        return wkt;
        // return s;
    }

    gobelTolatlng(Cartesian3) {
        var cartesian3 = new Cesium.Cartesian3(Cartesian3.x, Cartesian3.y, Cartesian3.z);

        var cartograhphic = Cesium.Cartographic.fromCartesian(cartesian3)

        var lat = Cesium.Math.toDegrees(cartograhphic.latitude);

        var lng = Cesium.Math.toDegrees(cartograhphic.longitude);
        return [lng, lat];
    }
    startCreate() {
        this.handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        var $this = this;
        this.handler.setInputAction(function (evt) { //单机开始绘制
            $this.viewer.scene.globe.depthTestAgainstTerrain = true;
            //屏幕坐标转地形上坐标
            var cartesian = $this.getCatesian3FromPX(evt.position);
            if ($this._positions.length == 0) {
                $this._positions.push(cartesian.clone());
                $this.floatingPoint = $this.createPoint(cartesian);
            }
            if (!$this._cicle) {
                $this.createPoint(cartesian);// 绘制点
            }
            $this._positions.push(cartesian);
        }, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制圆
            if ($this._positions.length < 1) return;
            var cartesian = $this.viewer.scene.pickPosition(evt.endPosition);// $this.getCatesian3FromPX(evt.endPosition);
            if (!$this.Cesium.defined($this._cicle)) {
                $this._cicle = $this.createCicle();
            }
            $this.floatingPoint.position.setValue(cartesian);
            if ($this._cicle) {
                $this._positions.pop();
                $this._positions.push(cartesian);
            }
        }, $this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) {
            if (!$this._cicle) return;
            $this.viewer.scene.globe.depthTestAgainstTerrain = false;
            var cartesian = $this.viewer.scene.pickPosition(evt.position); // $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this._cicleData = $this._positions.concat();
            $this.viewer.entities.remove($this._cicle); //移除
            $this._cicle = null;
            $this._positions = [];
            $this.floatingPoint.position.setValue(cartesian);
            var cicle = $this.loadCicle($this._cicleData); //加载
            $this._entities_cicle.push(cicle);
            $this._cicleLast = cicle;
            $this.clearPoint();
            $this.viewer.trackedEntity = undefined;

            if (typeof $this.callback == "function") {
                $this.callback(cicle);
            }
            $this.destroy();
        }, $this.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return this;
    }
    checkPositions() {
        let flag = true;
        for (let item of this._positions) {
            if (!item || !item.x) {
                flag = false;
                break;
            }
        }

        return flag;
    }
    //创建圆
    createCicle() {
        // if(this.checkPositions()){
        var that = this;
        var shape = this.viewer.entities.add({
            position: that._positions[0],
            name: "circle",
            type: "circle",
            ellipse: {
                semiMinorAxis: new that.Cesium.CallbackProperty(() => {
                    //半径 两点间距离
                    if (that.checkPositions()) {
                        var r = Math.sqrt(
                            Math.pow(that._positions[0].x - that._positions[that._positions.length - 1].x, 2) +
                            Math.pow(that._positions[0].y - that._positions[that._positions.length - 1].y, 2)
                        );
                        return r ? r : r + 1;
                    }

                }, false),
                semiMajorAxis: new that.Cesium.CallbackProperty(() => {
                    if (that.checkPositions()) {
                        var r = Math.sqrt(
                            Math.pow(that._positions[0].x - that._positions[that._positions.length - 1].x, 2) +
                            Math.pow(that._positions[0].y - that._positions[that._positions.length - 1].y, 2)
                        );
                        return r ? r : r + 1;
                    }

                }, false),
                material: that.Cesium.Color.RED.withAlpha(0.5),
                outline: true
            }
        });
        that._entities_cicle.push(shape);
        return shape;
        // }

    }

    //创建点
    createPoint(cartesian) {
        var $this = this;
        var point = this.viewer.entities.add({
            position: cartesian,
            point: {
                pixelSize: 10,
                color: $this.Cesium.Color.YELLOW,
            }
        });;
        $this._entities_point.push(point);
        return point;
    }

    // aleartElMessageBox(area) {
    //     if (area > 1000000)
    //         ElMessageBox.alert('选择范围超过100w平方m,请选择更精确的范围!', {
    //             // if you want to disable its autofocus
    //             // autofocus: false,
    //             confirmButtonText: 'OK',
    //             callback: () => {
    //                 this.clear();
    //                 return;
    //             },
    //         })
    // }
    getArea(radius) {
        var PI = Math.PI;
        var area = PI * radius * radius;
        return area;
    };
    getCatesian3FromPX(px) {
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }

    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }

    clearPoint() {
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        this._entities_point = [];  //脏数据
    }
    clear() {
        this.destroy()
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }

        for (var i = 0; i < this._entities_cicle.length; i++) {
            this.viewer.entities.remove(this._entities_cicle[i]);
        }
        this._cicle = null; //活动圆
        this.floatingPoint = null;
        this._cicleLast = null; //最后一个圆
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_cicle = [];  //脏数据
        this._cicleData = null; //用于构造圆形数据
    }
}

/*
绘制面
 */
class DrawPolygon {
    constructor(arg) {
        this.viewer = arg.viewer;
        this.Cesium = Cesium;
        this.callback = arg.callback;
        this._polygon = null;  //活动面
        this._polygonLast = null;  //最后一个面
        this._positions = []; //活动点
        this._entities_point = [];  //脏数据
        this._entities_polygon = [];  //脏数据
        this._polygonData = null; //用户构造面
    }

    //返回最后活动面
    get polygon() {
        return this._polygonLast;
    }

    //返回面数据用于加载面
    getData() {
        return this._polygonData;
    }

    //加载面
    loadPolygon(data) {
        var $this = this;
        return this.viewer.entities.add({
            polygon: {
                hierarchy: new $this.Cesium.PolygonHierarchy(data),
                clampToGround: false,
                show: true,
                fill: true,
                material: $this.Cesium.Color.RED.withAlpha(0.5),
                width: 3,
                outlineColor: $this.Cesium.Color.BLACK,
                outlineWidth: 1,
                outline: false
            }
        });
    }
    checkPositions() {
        let flag = true;
        for (let item of this._positions) {
            if (!item || !item.x) {
                flag = false;
                break;
            }
        }

        return flag;
    }

    getDatawkt() {
        let wktarray = [];
        var areaArrayPoint = [];

        var wkt = `POLYGON((`;
        var rectangleEndData = this.getData();
        var firstlng = null;
        for (let index = 0; index < rectangleEndData.length; index++) {

            const element = rectangleEndData[index];
            let e = this.gobelTolatlng(element)
            let cartesian = Cesium.Cartesian3.fromDegrees(e[0], e[1])
            areaArrayPoint.push(cartesian)
            if (index == 0) {
                firstlng = e;
            }
            if (index == rectangleEndData.length - 1) {
                wkt += `${e[0]} ${e[1]},${firstlng[0]} ${firstlng[1]}`
                break;

            }
            wkt += `${e[0]} ${e[1]},`

            wktarray.push(e);
        }

        wkt += `))`;

        let area = this.getArea(areaArrayPoint)
        // this.aleartElMessageBox(area);

        return { wkt, area };

    }

    gobelTolatlng(Cartesian3) {
        if (Cartesian3)
            var cartesian3 = new Cesium.Cartesian3(Cartesian3.x, Cartesian3.y, Cartesian3.z);

        var cartograhphic = Cesium.Cartographic.fromCartesian(cartesian3)

        var lat = Cesium.Math.toDegrees(cartograhphic.latitude);

        var lng = Cesium.Math.toDegrees(cartograhphic.longitude);
        return [lng, lat];
    }
    //开始绘制
    startCreate() {
        var $this = this;
        this.handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function (evt) { //单机开始绘制
            var cartesian = $this.getCatesian3FromPX(evt.position);
            if ($this._positions.length == 0) {
                $this._positions.push(cartesian.clone());
            }
            $this.createPoint(cartesian);
            $this._positions.push(cartesian);
        }, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制面
            if ($this._positions.length < 1) return;
            var cartesian = $this.getCatesian3FromPX(evt.endPosition);
            if ($this._positions.length == 3) {
                if (!$this.Cesium.defined($this._polygon)) {
                    $this._polygon = $this.createPolygon();
                }
            }
            $this._positions.pop();
            $this._positions.push(cartesian);
        }, $this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) {
            if (!$this._polygon) return;
            $this.viewer.trackedEntity = undefined;
            var cartesian = $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this.createPoint(cartesian);
            $this._polygonData = $this._positions.concat();
            $this.viewer.entities.remove($this._positions); //移除
            $this._positions = null;
            $this._positions = [];
            var Polygon = $this.loadPolygon($this._polygonData);
            $this._entities_polygon.push(Polygon);

            $this._polygonLast = Polygon;
            if (typeof $this.callback == "function") {
                $this.callback(Polygon);
            }
            $this.destroy();
        }, $this.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return this;
    }

    aleartElMessageBox(area) {
        if (area > 1000000)
            ElMessageBox.alert('选择范围超过100w平方m,请选择更精确的范围!', {
                // if you want to disable its autofocus
                // autofocus: false,
                confirmButtonText: 'OK',
                callback: () => {
                    this.clear();
                    return;
                },
            })
    }
    getArea(points) {
        var res = 0;
        //拆分三角曲面

        for (var i = 0; i < points.length - 2; i++) {
            var j = (i + 1) % points.length;
            var k = (i + 2) % points.length;
            var totalAngle = this.Angle(points[i], points[j], points[k]);

            var dis_temp1 = this.distance(points[j], points[0]);
            var dis_temp2 = this.distance(points[k], points[0]);
            res += dis_temp1 * dis_temp2 * Math.sin(totalAngle) / 2;
        }
        res = Math.abs(res).toFixed(4);

        // if (res < 1000000) {
        //     res = Math.abs(res).toFixed(4) + " 平方米";
        // } else {
        //     res = Math.abs((res / 1000000.0).toFixed(4)) + " 平方公里";
        // }

        return res;

    };

    distance(point1, point2) {
        var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        return s;
    }

    /*角度*/
    Angle(p1, p2, p3) {
        var bearing21 = this.Bearing(p2, p1);
        var bearing23 = this.Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }
    /*方向*/
    Bearing(from, to) {
        from = Cesium.Cartographic.fromCartesian(from);
        to = Cesium.Cartographic.fromCartesian(to);

        var lat1 = from.latitude;
        var lon1 = from.longitude;
        var lat2 = to.latitude;
        var lon2 = to.longitude;
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度

        angle = angle * degreesPerRadian; //角度
        return angle;
    }
    //创建面
    createPolygon() {
        var $this = this;

        var polygon = this.viewer.entities.add({
            polygon: {
                hierarchy: new $this.Cesium.CallbackProperty(() => {
                    if ($this.checkPositions()) {
                        return new $this.Cesium.PolygonHierarchy($this._positions);
                    }

                }, false),
                clampToGround: true,
                show: true,
                fill: true,
                material: $this.Cesium.Color.RED.withAlpha(0.5),
                width: 3,
                outlineColor: $this.Cesium.Color.BLACK,
                outlineWidth: 1,
                outline: false
            }
        });
        $this._entities_polygon.push(polygon);
        return polygon;


    }

    //创建点
    createPoint(cartesian) {
        var $this = this;
        var point = this.viewer.entities.add({
            position: cartesian,
            point: {
                pixelSize: 10,
                color: $this.Cesium.Color.YELLOW,
            }
        });
        $this._entities_point.push(point);
        return point;
    }


    //销毁事件
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }

    //清空实体对象
    clear() {
        this.destroy()
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        for (var i = 0; i < this._entities_polygon.length; i++) {
            this.viewer.entities.remove(this._entities_polygon[i]);
        }
        this._polygon = null;  //活动面
        this._polygonLast = null;  //最后一个面
        this._positions = []; //活动点
        this._entities_point = [];  //脏数据
        this._entities_polygon = [];  //脏数据
        this._polygonData = null; //用户构造面
    }

    getCatesian3FromPX(px) {
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }
}



// 绘制标绘点
class DrawPoint {
    constructor(arg) {
        this.viewer = arg.viewer;
        this.Cesium = Cesium;
        this.callback = arg.callback;
        this._polygon = null;  //活动面
        this._polygonLast = null;  //最后一个面
        this._positions = []; //活动点
        this._entities_point = [];  //脏数据
        this._entities_polygon = [];  //脏数据
        this._polygonData = null; //用户构造面
        this.isDraw = true
        this.imagestyle = arg.imagestyle;
        this.tooltip = null;

        if (arg.mapstyle == 'left') {
            this.tooltip = document.getElementById('iamgetip_left');
        } else if (arg.mapstyle == 'right') {
            this.tooltip = document.getElementById('iamgetip_right');
        } else {
            this.tooltip = document.getElementById('iamgetip');
        }

        this.tooltip.innerHTML = '';
        this.tooltip.style = "position:absolute;z-index:100;display:none;"
        this.im = document.createElement("img");//创建图片
        if (this.imagestyle == 'needlePoint') {
            this.im.src = needlePoint;

        } else if (this.imagestyle == "flagPoint") {
            this.im.src = flagPoint;

        } else if (this.imagestyle == "PositionPoint") {
            this.im.src = PositionPoint;

        }
        //图片设置成和div一样大小
        this.im.style.width = 5;
        this.im.style.height = 5;
        this.tooltip.appendChild(this.im);

    }

    //返回最后活动面
    get polygon() {
        return this._polygonLast;
    }

    //返回面数据用于加载面
    getData() {
        return this._polygonData;
    }

    //加载面
    loadPolygon(data) {
        var $this = this;
        return this.viewer.entities.add({

            position: data,
            point: {
                color: Cesium.Color.RED,
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 2,
                // heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
            }
        })


    }
    checkPositions() {
        let flag = true;
        for (let item of this._positions) {
            if (!item || !item.x) {
                flag = false;
                break;
            }
        }

        return flag;
    }
    //开始绘制
    startCreate() {
        var $this = this;
        this.handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function (evt) { //单机开始绘制
            var cartesian = $this.getCatesian3FromPX(evt.position);
            $this.createPoint(cartesian);
            $this.tooltip.style.display = 'none'
            $this.tooltip.removeChild($this.im);
            if (typeof $this.callback == "function") {
                $this.callback();
            }
            // $this._positions.push(cartesian);
        }, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.handler.setInputAction(function (evt) { //移动时绘制面
            // if ($this._positions.length < 1) return;

            if ($this.isDraw) {
                $this.tooltip.style.left = evt.endPosition.x + 10 + 'px'
                $this.tooltip.style.top = evt.endPosition.y + 10 + 'px'
                $this.tooltip.style.display = 'block'
            }
        }, $this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        return this;
    }
    //创建点
    createPoint(cartesian) {
        var $this = this;
        let iamges = null;
        if (this.imagestyle == 'needlePoint') {
            iamges = needlePoint;

        } else if (this.imagestyle == "flagPoint") {
            iamges = flagPoint;

        } else if (this.imagestyle == "PositionPoint") {
            iamges = PositionPoint;

        }
        var point = this.viewer.entities.add({
            position: cartesian,
            // point: {
            //     pixelSize: 10,
            //     color: $this.Cesium.Color.YELLOW,
            // },
            billboard: {
                // 图像地址，URI或Canvas的属性
                image: iamges,
                // // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
                scale: 0.7,

            }

        });
        $this._entities_point.push(point);
        return point;
    }


    //销毁事件
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }

    //清空实体对象
    clear() {
        this.destroy()
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        for (var i = 0; i < this._entities_polygon.length; i++) {
            this.viewer.entities.remove(this._entities_polygon[i]);
        }
        this._polygon = null;  //活动面
        this._polygonLast = null;  //最后一个面
        this._positions = []; //活动点
        this._entities_point = [];  //脏数据
        this._entities_polygon = [];  //脏数据
        this._polygonData = null; //用户构造面
    }

    getCatesian3FromPX(px) {
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }
}




export { DrawRectangle, DrawCircle, DrawPolygon, DrawPoint }