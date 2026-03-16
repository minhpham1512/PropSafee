// ===== Seed Database with Initial Properties =====
// Run: npm run seed (or: node seed/seed.js)

require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('../models/Property');

const SEED_DATA = [
    {
        name: "Căn hộ cao cấp Vinhomes Central Park",
        address: "208 Nguyễn Hữu Cảnh, Bình Thạnh",
        lat: 10.7942, lng: 106.7214,
        price: "5.2 tỷ", priceNum: 5200,
        area: "85m²", type: "Căn hộ", bedrooms: 2,
        description: "Căn hộ view sông, nội thất cao cấp, sổ hồng đầy đủ",
        riskScore: 18, source: "manual",
        agents: {
            legal: { score: 12, findings: [
                { text: "Sổ hồng chính chủ, pháp lý rõ ràng", positive: true },
                { text: "Không nằm trong diện quy hoạch", positive: true },
                { text: "Không có tranh chấp lịch sử", positive: true }
            ]},
            market: { score: 22, findings: [
                { text: "Giá phù hợp thị trường khu vực", positive: true },
                { text: "Tốc độ tăng giá ổn định 8%/năm", positive: true },
                { text: "Thanh khoản cao", positive: true }
            ]},
            environment: { score: 15, findings: [
                { text: "Không nằm trong vùng ngập", positive: true },
                { text: "Hạ tầng đồng bộ, gần metro", positive: true },
                { text: "Mật độ dân cư hợp lý", positive: true }
            ]},
            fraud: { score: 10, findings: [
                { text: "Chủ đầu tư uy tín (Vingroup)", positive: true },
                { text: "Thông tin nhất quán trên nhiều nguồn", positive: true },
                { text: "Lịch sử giao dịch minh bạch", positive: true }
            ]}
        }
    },
    {
        name: "Đất nền Long An - Mặt tiền QL1A",
        address: "Quốc lộ 1A, Bến Lức, Long An",
        lat: 10.6453, lng: 106.4890,
        price: "1.8 tỷ", priceNum: 1800,
        area: "200m²", type: "Đất nền", bedrooms: 0,
        description: "Đất mặt tiền quốc lộ, phù hợp kinh doanh",
        riskScore: 72, source: "manual",
        agents: {
            legal: { score: 78, findings: [
                { text: "Đất đang trong diện quy hoạch mở rộng QL", negative: true },
                { text: "Sổ đỏ là đất nông nghiệp, chưa chuyển đổi", negative: true },
                { text: "Có tranh chấp ranh giới với hộ liền kề", negative: true }
            ]},
            market: { score: 65, findings: [
                { text: "Giá thấp bất thường so với mặt tiền QL", negative: true },
                { text: "Ít giao dịch thành công trong 2 năm", negative: true }
            ]},
            environment: { score: 70, findings: [
                { text: "Nằm trong vùng ngập theo bản đồ rủi ro", negative: true },
                { text: "Thiếu hạ tầng thoát nước", negative: true },
                { text: "Gần khu công nghiệp - ô nhiễm", negative: true }
            ]},
            fraud: { score: 55, findings: [
                { text: "Giá thấp bất thường - cần xác minh", negative: true },
                { text: "Tin đăng mới, không có lịch sử", negative: true }
            ]}
        }
    },
    {
        name: "Đất nền dự án ma Cần Giuộc",
        address: "Huyện Cần Giuộc, Long An",
        lat: 10.5911, lng: 106.6357,
        price: "650 triệu", priceNum: 650,
        area: "100m²", type: "Đất nền", bedrooms: 0,
        description: "Đất nền phân lô, cam kết sổ đỏ trong 6 tháng",
        riskScore: 92, source: "manual",
        agents: {
            legal: { score: 95, findings: [
                { text: "DỰ ÁN MA - không có giấy phép phân lô", negative: true },
                { text: "Đất nông nghiệp phân lô trái phép", negative: true },
                { text: "Chính quyền đã cảnh báo dự án này", negative: true }
            ]},
            market: { score: 88, findings: [
                { text: "Giá THẤP BẤT THƯỜNG - 6.5tr/m²", negative: true },
                { text: "Không có giao dịch hợp pháp", negative: true }
            ]},
            environment: { score: 85, findings: [
                { text: "Vùng ngập triều cường nghiêm trọng", negative: true },
                { text: "Không có đường, điện, nước", negative: true }
            ]},
            fraud: { score: 95, findings: [
                { text: "CẢNH BÁO: trùng mô hình lừa đảo phổ biến", negative: true },
                { text: "SĐT liên kết với 15 tin lừa đảo khác", negative: true },
                { text: "Ảnh 3D render giả mạo dự án hoàn thiện", negative: true }
            ]}
        }
    },
    {
        name: "Biệt thự Phú Mỹ Hưng",
        address: "Khu đô thị Phú Mỹ Hưng, Quận 7",
        lat: 10.7285, lng: 106.7195,
        price: "42 tỷ", priceNum: 42000,
        area: "300m²", type: "Biệt thự", bedrooms: 5,
        description: "Biệt thự song lập, khu an ninh, tiện ích đẳng cấp",
        riskScore: 12, source: "manual",
        agents: {
            legal: { score: 8, findings: [
                { text: "Pháp lý hoàn chỉnh, sổ hồng vĩnh viễn", positive: true },
                { text: "Khu đô thị quy hoạch bài bản", positive: true }
            ]},
            market: { score: 15, findings: [
                { text: "Giá phù hợp phân khúc cao cấp", positive: true },
                { text: "Tăng giá ổn định, ít biến động", positive: true }
            ]},
            environment: { score: 10, findings: [
                { text: "Hệ thống thoát nước hiện đại", positive: true },
                { text: "Không gian xanh rộng lớn", positive: true }
            ]},
            fraud: { score: 5, findings: [
                { text: "Giao dịch qua sàn chính thức", positive: true },
                { text: "Thông tin xác minh đa nguồn", positive: true }
            ]}
        }
    }
];

async function seed() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri || uri.includes('YOUR_USERNAME')) {
            console.error('❌ Please configure MONGO_URI in backend/.env first');
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB Atlas');

        // Clear existing data
        await Property.deleteMany({});
        console.log('🗑️  Cleared existing properties');

        // Insert seed data
        const result = await Property.insertMany(SEED_DATA);
        console.log(`✅ Seeded ${result.length} properties`);

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');

    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
