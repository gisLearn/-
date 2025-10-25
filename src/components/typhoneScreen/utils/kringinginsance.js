/*
 * @Author: dwzhuyugang 834737857@qq.com
 * @Date: 2023-07-21 14:45:28
 * @LastEditors: your name
 * @LastEditTime: 2025-10-23 22:27:46
 * @FilePath: \-\src\components\typhoneScreen\utils\kringinginsance.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import gdqxj from "@/components/typhoneScreen/utils/gdqxj.js";

import Bubble from "@/components/typhoneScreen/utils/index";


let rsrpPointArray = [];//rsrp值数据组
class loadKring {
    constructor(viewer, values, colors, minmax, coords, ex) {
        this.viewer = viewer;
        this.values = values;
        this.colors = colors;
        this.minmax = minmax;
        this.coords = coords;
        this.bound = ex;
        this.lchight = 0;
        this.koadkringEntity = null;
        this.AllBubbleArray = []

    }

    init() {

        var canvas = document.getElementById("canvasMap");
        canvas.width = 5000;
        canvas.height = 5000;
        var n = this.values;
        var t = [];
        var x = [];
        var y = [];
        let _coords = this.coords;
        n.forEach(element => {
            t.push(Number(element.lte_pci)); // 权重值
            x.push(element.lng); // x
            y.push(element.lat); // y

        });


        var variogram = kriging.train(t, x, y, "exponential", 0, 60);


        // 边界数据
        // let bounds = [[
        //     [113.394744269093408, 23.177949718732982],
        //     [113.395230207989911, 23.177797233430315],
        //     [113.395183483096005, 23.177661929424723],
        //     [113.394952194871252, 23.177741393698554],
        //     [113.394898461243272, 23.177580317418691],
        //     [113.394898461243272, 23.177580317418691],
        //     [113.395143766936215, 23.17749440999016],
        //     [113.395104050776411, 23.17735051492382],
        //     [113.394608766901143, 23.177518034538508],
        //     [113.394744269093408, 23.177949718732982]
        // ]]
        // bounds[0].forEach(element => {

        //     _coords.push(element[0], element[1])
        // });
        let gridv = (this.minmax.maxy - this.minmax.miny) / 600;
        //    0.000001为克里金插值分辨率值越小网格越小，加载越慢
        var grid = kriging.grid(this.bound, variogram, gridv);
        //   var colors = ["#00A600", "#01A600", "#03A700", "#04A700", "#05A800", "#07A800", "#08A900", "#09A900", "#0BAA00", "#0CAA00", "#0DAB00", "#0FAB00", "#10AC00", "#12AC00", "#13AD00", "#14AD00", "#16AE00", "#17AE00", "#19AF00", "#1AAF00", "#1CB000", "#1DB000", "#1FB100", "#20B100", "#22B200", "#23B200", "#25B300", "#26B300", "#28B400", "#29B400", "#2BB500", "#2CB500", "#2EB600", "#2FB600", "#31B700", "#33B700", "#34B800", "#36B800", "#37B900", "#39B900", "#3BBA00", "#3CBA00", "#3EBB00", "#3FBB00", "#41BC00", "#43BC00", "#44BD00", "#46BD00", "#48BE00", "#49BE00", "#4BBF00", "#4DBF00", "#4FC000", "#50C000", "#52C100", "#54C100", "#55C200", "#57C200", "#59C300", "#5BC300", "#5DC400", "#5EC400", "#60C500", "#62C500", "#64C600", "#66C600", "#67C700", "#69C700", "#6BC800", "#6DC800", "#6FC900", "#71C900", "#72CA00", "#74CA00", "#76CB00", "#78CB00", "#7ACC00", "#7CCC00", "#7ECD00", "#80CD00", "#82CE00", "#84CE00", "#86CF00", "#88CF00", "#8AD000", "#8BD000", "#8DD100", "#8FD100", "#91D200", "#93D200", "#95D300", "#97D300", "#9AD400", "#9CD400", "#9ED500", "#A0D500", "#A2D600", "#A4D600", "#A6D700", "#A8D700", "#AAD800", "#ACD800", "#AED900", "#B0D900", "#B2DA00", "#B5DA00", "#B7DB00", "#B9DB00", "#BBDC00", "#BDDC00", "#BFDD00", "#C2DD00", "#C4DE00", "#C6DE00", "#C8DF00", "#CADF00", "#CDE000", "#CFE000", "#D1E100", "#D3E100", "#D6E200", "#D8E200", "#DAE300", "#DCE300", "#DFE400", "#E1E400", "#E3E500", "#E6E600", "#E6E402", "#E6E204", "#E6E105", "#E6DF07", "#E6DD09", "#E6DC0B", "#E6DA0D", "#E6D90E", "#E6D710", "#E6D612", "#E7D414", "#E7D316", "#E7D217", "#E7D019", "#E7CF1B", "#E7CE1D", "#E7CD1F", "#E7CB21", "#E7CA22", "#E7C924", "#E8C826", "#E8C728", "#E8C62A", "#E8C52B", "#E8C42D", "#E8C32F", "#E8C231", "#E8C133", "#E8C035", "#E8BF36", "#E9BE38", "#E9BD3A", "#E9BC3C", "#E9BB3E", "#E9BB40", "#E9BA42", "#E9B943", "#E9B945", "#E9B847", "#E9B749", "#EAB74B", "#EAB64D", "#EAB64F", "#EAB550", "#EAB552", "#EAB454", "#EAB456", "#EAB358", "#EAB35A", "#EAB35C", "#EBB25D", "#EBB25F", "#EBB261", "#EBB263", "#EBB165", "#EBB167", "#EBB169", "#EBB16B", "#EBB16C", "#EBB16E", "#ECB170", "#ECB172", "#ECB174", "#ECB176", "#ECB178", "#ECB17A", "#ECB17C", "#ECB17E", "#ECB27F", "#ECB281", "#EDB283", "#EDB285", "#EDB387", "#EDB389", "#EDB38B", "#EDB48D", "#EDB48F", "#EDB591", "#EDB593", "#EDB694", "#EEB696", "#EEB798", "#EEB89A", "#EEB89C", "#EEB99E", "#EEBAA0", "#EEBAA2", "#EEBBA4", "#EEBCA6", "#EEBDA8", "#EFBEAA", "#EFBEAC", "#EFBFAD", "#EFC0AF", "#EFC1B1", "#EFC2B3", "#EFC3B5", "#EFC4B7", "#EFC5B9", "#EFC7BB", "#F0C8BD", "#F0C9BF", "#F0CAC1", "#F0CBC3", "#F0CDC5", "#F0CEC7", "#F0CFC9", "#F0D1CB", "#F0D2CD", "#F0D3CF", "#F1D5D1", "#F1D6D3", "#F1D8D5", "#F1D9D7", "#F1DBD8", "#F1DDDA", "#F1DEDC", "#F1E0DE", "#F1E2E0", "#F1E3E2", "#F2E5E4", "#F2E7E6", "#F2E9E8", "#F2EBEA", "#F2ECEC", "#F2EEEE", "#F2F0F0", "#F2F2F2"];
        // kriging.plot(this._canvas, grid, [this.minx, this.maxx], [this.miny, this.maxy], this.colors);


        kriging.plot(canvas, grid,
            [this.minmax.minx, this.minmax.maxx],
            [this.minmax.miny, this.minmax.maxy], this.colors);

        let imageurl = this.returnImgae();

        this.koadkringEntity = this.viewer.entities.add({
            id: "F1",
            polygon: {
                show: true,
                // clampToGround: true,
                hierarchy: {
                    positions: Cesium.Cartesian3.fromDegreesArray(_coords)
                },
                // hierarchy: new Cesium.PolygonHierarchy(
                //     Cesium.Cartesian3.fromDegreesArray(_coords)
                // ),
                extrudedHeight: 10,
                height: 0,
                material: new Cesium.ImageMaterialProperty({
                    image: imageurl,//使用贴图的方式将结果贴到面上
                })
            }
        });

        this.addlabelPoint();

        // return _entyInstance;

    };

    returnImgae() {
        var mycanvas = document.getElementById("canvasMap");
        return mycanvas.toDataURL("image/png");
    }


    removeSceneEntity() {
        if (this.koadkringEntity) {
            this.viewer.entities.remove(this.koadkringEntity);
            this.koadkringEntity = null;
        }

        if (this.AllBubbleArray.length > 0) {
            this.AllBubbleArray.forEach(element => {
                element.windowClose();
            });

            this.AllBubbleArray = [];
        }
    }

    addlabelPoint() {

        this.values.forEach(element => {
            let postionValue = Cesium.Cartesian3.fromDegrees(element.lng, element.lat, 2000)
            let bubbles = new Bubble({
                info: element,
                viewer: this.viewer,
                postionValue
            });
            this.AllBubbleArray.push(bubbles);
        });

    }


};



function _getJsonData() {
    let coords = [];

    // let data = await getBuildingGoejson(`./geojson/nanji_jichu_data.geojson`); // 获取楼层信息
    // const { data } = await axios.get(this.jsonUrl)

    let ex = gdqxj.features[0].geometry.coordinates;
    // let ex = data.features[0].geometry.coordinates; // 流域边界面
    ex[0].forEach(element => {
        coords.push(element[0]);
        coords.push(element[1]);
    });

    const polygonHierarchy = new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray(coords)
    );

    //范围（弧度）
    let extent = Cesium.PolygonGeometry.computeRectangle({
        polygonHierarchy: polygonHierarchy
    });
    let minx = Cesium.Math.toDegrees(extent.west); //转换为经纬度
    let miny = Cesium.Math.toDegrees(extent.south);
    let maxx = Cesium.Math.toDegrees(extent.east);
    let maxy = Cesium.Math.toDegrees(extent.north);

    return {
        minmaxvalue: {
            minx,
            miny,
            maxx,
            maxy
        },
        coords,
        ex
    };
};
// 加载楼宇点位数据
function addLYBuildingPoint(viewer, arryPoint, height, floornumber) {


    if (arryPoint.length == 0)
        return;

    //    删除点

    arryPoint.forEach((element, index) => {
        let getlycgiBuildingPoint = element;
        let pointlabel = viewer.entities.add({
            name: floornumber,
            position: Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + 1),
            // 点
            point: {
                color: Cesium.Color.BLUE, // 点位颜色
                pixelSize: 6 // 像素点大小
            },
            // 文字
            label: {
                // 文本。支持显式换行符“ \ n”
                text: element.lte_pci || "",
                // 字体样式，以CSS语法指定字体
                font: '8pt Source Han Sans CN',
                // 字体颜色
                fillColor: Cesium.Color.BLACK,
                // 背景颜色
                backgroundColor: Cesium.Color.AQUA,
                // 是否显示背景颜色
                showBackground: false,
                // 字体边框
                outline: true,
                // 字体边框颜色
                outlineColor: Cesium.Color.WHITE,
                // 字体边框尺寸
                outlineWidth: 10,
                // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
                scale: 1,
                // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                // 相对于坐标的水平位置
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                // 相对于坐标的水平位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
                pixelOffset: new Cesium.Cartesian2(0, -15),
                // 是否显示
                show: true
            },
            properties: {
                type: "cgiBuildingPoint",
                getlycgiBuildingPoint
            }
        });


        rsrpPointArray.push(pointlabel);
    });

}


function removeLYBuildingPoint(viewer) {
    if (rsrpPointArray.length == 0)
        return;

    rsrpPointArray.forEach(element => {
        viewer.entities.remove(element);
    });

    rsrpPointArray = [];

}

function changepointshow(floornumber) {
    if (rsrpPointArray.length == 0)
        return;

    rsrpPointArray.forEach(element => {
        if (element.name == floornumber || floornumber == "F1-6") {
            element.show = true;
        } else {
            element.show = false;
        }
    });
}




export { loadKring, _getJsonData, addLYBuildingPoint, removeLYBuildingPoint, changepointshow }