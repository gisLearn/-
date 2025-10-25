const stationData = require('./public/data/station.json');
const gdqxjpoint = require('./src/components/typhoneScreen/utils/gdqxjpoint.js').default;

// 获取station.json中的数据
const typhoonName = Object.keys(stationData.data)[0];
const stationList = stationData.data[typhoonName].station;

// 获取gdqxjpoint中的数据
const gdqxjpointList = gdqxjpoint.features;

console.log('=== 数据对比报告 ===\n');

console.log(`station.json 中台风"${typhoonName}"包含 ${stationList.length} 个城市`);
console.log(`gdqxjpoint.js 中包含 ${gdqxjpointList.length} 个城市\n`);

// 创建映射表便于比较
const stationMap = new Map();
stationList.forEach(station => {
    stationMap.set(station.name, {
        name: station.name,
        longitude: parseFloat(station.longitude),
        latitude: parseFloat(station.latitude),
        value: station.value
    });
});

const gdqxjpointMap = new Map();
gdqxjpointList.forEach(feature => {
    const props = feature.properties;
    const coords = feature.geometry.coordinates;
    gdqxjpointMap.set(props.name, {
        name: props.name,
        longitude: coords[0],
        latitude: coords[1],
        value: props.value
    });
});

// 检查城市数量是否一致
console.log('1. 城市数量对比:');
if (stationMap.size === gdqxjpointMap.size) {
    console.log(`   ✓ 城市数量一致，均为 ${stationMap.size} 个`);
} else {
    console.log(`   ✗ 城市数量不一致，station.json: ${stationMap.size} 个，gdqxjpoint.js: ${gdqxjpointMap.size} 个`);
}

// 检查城市名称是否一致
console.log('\n2. 城市名称对比:');
const stationCities = Array.from(stationMap.keys());
const gdqxjpointCities = Array.from(gdqxjpointMap.keys());

const onlyInStation = stationCities.filter(city => !gdqxjpointMap.has(city));
const onlyInGdqxjpoint = gdqxjpointCities.filter(city => !stationMap.has(city));

if (onlyInStation.length === 0 && onlyInGdqxjpoint.length === 0) {
    console.log('   ✓ 城市名称完全一致');
} else {
    if (onlyInStation.length > 0) {
        console.log(`   ✗ 以下城市仅在 station.json 中存在: ${onlyInStation.join(', ')}`);
    }
    if (onlyInGdqxjpoint.length > 0) {
        console.log(`   ✗ 以下城市仅在 gdqxjpoint.js 中存在: ${onlyInGdqxjpoint.join(', ')}`);
    }
}

// 检查经纬度和值是否一致
console.log('\n3. 数据详细对比:');
let dataMismatchCount = 0;

stationMap.forEach((station, cityName) => {
    if (gdqxjpointMap.has(cityName)) {
        const gdqxjpointData = gdqxjpointMap.get(cityName);
        
        // 比较经度 (允许小数点后10位的误差)
        const lonDiff = Math.abs(station.longitude - gdqxjpointData.longitude);
        // 比较纬度 (允许小数点后10位的误差)
        const latDiff = Math.abs(station.latitude - gdqxjpointData.latitude);
        // 比较值
        const valueDiff = Math.abs(station.value - gdqxjpointData.value);
        
        const lonMatch = lonDiff < 1e-10;
        const latMatch = latDiff < 1e-10;
        const valueMatch = valueDiff < 1e-10;
        
        if (!lonMatch || !latMatch || !valueMatch) {
            dataMismatchCount++;
            console.log(`   ✗ ${cityName}:`);
            if (!lonMatch) console.log(`     经度不一致: station=${station.longitude}, gdqxjpoint=${gdqxjpointData.longitude}`);
            if (!latMatch) console.log(`     纬度不一致: station=${station.latitude}, gdqxjpoint=${gdqxjpointData.latitude}`);
            if (!valueMatch) console.log(`     值不一致: station=${station.value}, gdqxjpoint=${gdqxjpointData.value}`);
        }
    }
});

if (dataMismatchCount === 0) {
    console.log('   ✓ 所有共同城市的经纬度和值完全一致');
} else {
    console.log(`   ✗ 共有 ${dataMismatchCount} 个城市的经纬度或值不一致`);
}

console.log('\n=== 对比完成 ===');