// ===== Property Data - Ho Chi Minh City =====
// Mock data for 15 properties with pre-assigned risk analysis

let PROPERTIES = [];
const MOCK_PROPERTIES = [
    {
        id: 1,
        name: "Căn hộ cao cấp Vinhomes Central Park",
        address: "208 Nguyễn Hữu Cảnh, Bình Thạnh",
        lat: 10.7942,
        lng: 106.7214,
        price: "5.2 tỷ",
        priceNum: 5200,
        area: "85m²",
        type: "Căn hộ",
        bedrooms: 2,
        description: "Căn hộ view sông, nội thất cao cấp, sổ hồng đầy đủ",
        riskScore: 18,
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
        id: 2,
        name: "Nhà phố Thảo Điền",
        address: "Xuân Thủy, Thảo Điền, Quận 2",
        lat: 10.8024,
        lng: 106.7352,
        price: "18 tỷ",
        priceNum: 18000,
        area: "120m²",
        type: "Nhà phố",
        bedrooms: 4,
        description: "Nhà phố 3 tầng, khu vực an ninh, gần trường quốc tế",
        riskScore: 25,
        agents: {
            legal: { score: 15, findings: [
                { text: "Sổ hồng đầy đủ, đã công chứng", positive: true },
                { text: "Quy hoạch ổn định khu vực", positive: true },
                { text: "Giấy phép xây dựng hợp lệ", positive: true }
            ]},
            market: { score: 35, findings: [
                { text: "Giá cao hơn 10% so với khu vực", negative: true },
                { text: "Khu vực đang có xu hướng tăng", positive: true },
                { text: "Nhu cầu thuê rất cao từ expats", positive: true }
            ]},
            environment: { score: 20, findings: [
                { text: "Nguy cơ ngập nhẹ vào mùa mưa", negative: true },
                { text: "Giao thông thuận tiện", positive: true },
                { text: "Nhiều tiện ích xung quanh", positive: true }
            ]},
            fraud: { score: 8, findings: [
                { text: "Tin đăng xác thực", positive: true },
                { text: "Giá phù hợp với diện tích", positive: true },
                { text: "Không có dấu hiệu bất thường", positive: true }
            ]}
        }
    },
    {
        id: 3,
        name: "Đất nền Long An - Mặt tiền QL1A",
        address: "Quốc lộ 1A, Bến Lức, Long An",
        lat: 10.6453,
        lng: 106.4890,
        price: "1.8 tỷ",
        priceNum: 1800,
        area: "200m²",
        type: "Đất nền",
        bedrooms: 0,
        description: "Đất mặt tiền quốc lộ, phù hợp kinh doanh",
        riskScore: 72,
        agents: {
            legal: { score: 78, findings: [
                { text: "Đất đang trong diện quy hoạch mở rộng QL", negative: true },
                { text: "Sổ đỏ là đất nông nghiệp, chưa chuyển đổi", negative: true },
                { text: "Có tranh chấp ranh giới với hộ liền kề", negative: true }
            ]},
            market: { score: 65, findings: [
                { text: "Giá thấp bất thường so với mặt tiền QL", negative: true },
                { text: "Ít giao dịch thành công trong 2 năm", negative: true },
                { text: "Khu vực chưa phát triển", neutral: true }
            ]},
            environment: { score: 70, findings: [
                { text: "Nằm trong vùng ngập theo bản đồ rủi ro", negative: true },
                { text: "Thiếu hạ tầng thoát nước", negative: true },
                { text: "Gần khu công nghiệp - ô nhiễm", negative: true }
            ]},
            fraud: { score: 55, findings: [
                { text: "Giá thấp bất thường - cần xác minh", negative: true },
                { text: "Tin đăng mới, không có lịch sử", neutral: true },
                { text: "Nhiều người bán cùng khu vực", neutral: true }
            ]}
        }
    },
    {
        id: 4,
        name: "Căn hộ Masteri Thảo Điền",
        address: "159 Xa lộ Hà Nội, Thảo Điền, TP Thủ Đức",
        lat: 10.8051,
        lng: 106.7450,
        price: "4.5 tỷ",
        priceNum: 4500,
        area: "70m²",
        type: "Căn hộ",
        bedrooms: 2,
        description: "Căn hộ view sông, tiện ích đầy đủ, gần Metro",
        riskScore: 15,
        agents: {
            legal: { score: 10, findings: [
                { text: "Pháp lý hoàn chỉnh, sổ hồng vĩnh viễn", positive: true },
                { text: "Chủ đầu tư Masterise Homes uy tín", positive: true },
                { text: "Không tranh chấp, quy hoạch ổn định", positive: true }
            ]},
            market: { score: 20, findings: [
                { text: "Giá hợp lý so với khu Thảo Điền", positive: true },
                { text: "Tăng giá đều 7-9%/năm", positive: true },
                { text: "Tỷ lệ lấp đầy >95%", positive: true }
            ]},
            environment: { score: 12, findings: [
                { text: "Hạ tầng đồng bộ, gần tuyến Metro số 1", positive: true },
                { text: "Không rủi ro ngập lụt", positive: true },
                { text: "Môi trường xanh, nhiều công viên", positive: true }
            ]},
            fraud: { score: 8, findings: [
                { text: "Chủ sở hữu xác minh danh tính", positive: true },
                { text: "Lịch sử giao dịch minh bạch", positive: true },
                { text: "Giá nhất quán với thị trường", positive: true }
            ]}
        }
    },
    {
        id: 5,
        name: "Đất vườn Củ Chi",
        address: "Xã Phú Hòa Đông, Củ Chi",
        lat: 10.9785,
        lng: 106.5671,
        price: "850 triệu",
        priceNum: 850,
        area: "500m²",
        type: "Đất vườn",
        bedrooms: 0,
        description: "Đất vườn giá rẻ, không quy hoạch",
        riskScore: 82,
        agents: {
            legal: { score: 90, findings: [
                { text: "Đất nông nghiệp, KHÔNG được phép xây dựng", negative: true },
                { text: "Nằm trong quy hoạch đất quân sự", negative: true },
                { text: "Sổ đỏ đứng tên người đã mất, chưa sang tên", negative: true }
            ]},
            market: { score: 70, findings: [
                { text: "Giá THẤP bất thường so với khu vực", negative: true },
                { text: "Không có giao dịch thành công gần đây", negative: true },
                { text: "Thanh khoản rất thấp", negative: true }
            ]},
            environment: { score: 75, findings: [
                { text: "Đường vào không được trải nhựa", negative: true },
                { text: "Thiếu điện nước sinh hoạt", negative: true },
                { text: "Xa trung tâm, hạ tầng yếu kém", negative: true }
            ]},
            fraud: { score: 85, findings: [
                { text: "Dấu hiệu lừa đảo: nhiều tin rao cùng mẫu", negative: true },
                { text: "Số điện thoại trùng với danh sách cảnh báo", negative: true },
                { text: "Ảnh minh họa lấy từ internet", negative: true }
            ]}
        }
    },
    {
        id: 6,
        name: "Chung cư Sunrise City",
        address: "23-25 Nguyễn Hữu Thọ, Quận 7",
        lat: 10.7325,
        lng: 106.7010,
        price: "3.8 tỷ",
        priceNum: 3800,
        area: "76m²",
        type: "Căn hộ",
        bedrooms: 2,
        description: "Căn hộ cao cấp khu Nam Sài Gòn, nội thất đầy đủ",
        riskScore: 28,
        agents: {
            legal: { score: 18, findings: [
                { text: "Sổ hồng riêng, pháp lý rõ ràng", positive: true },
                { text: "Không nằm trong diện quy hoạch", positive: true },
                { text: "Chủ đầu tư Novaland có uy tín trung bình", neutral: true }
            ]},
            market: { score: 32, findings: [
                { text: "Giá nhỉnh hơn 5% so với trung bình khu vực", neutral: true },
                { text: "Thanh khoản khá, khu vực phát triển", positive: true },
                { text: "Gần Phú Mỹ Hưng - yếu tố tích cực", positive: true }
            ]},
            environment: { score: 30, findings: [
                { text: "Nguy cơ ngập vừa vào mùa mưa", negative: true },
                { text: "Giao thông đông đúc giờ cao điểm", neutral: true },
                { text: "Tiện ích mua sắm đa dạng", positive: true }
            ]},
            fraud: { score: 12, findings: [
                { text: "Tin đăng xác thực, ảnh thực tế", positive: true },
                { text: "Chủ nhà đã xác minh", positive: true },
                { text: "Giá phù hợp thị trường", positive: true }
            ]}
        }
    },
    {
        id: 7,
        name: "Biệt thự Phú Mỹ Hưng",
        address: "Khu đô thị Phú Mỹ Hưng, Quận 7",
        lat: 10.7285,
        lng: 106.7195,
        price: "42 tỷ",
        priceNum: 42000,
        area: "300m²",
        type: "Biệt thự",
        bedrooms: 5,
        description: "Biệt thự song lập, khu an ninh, tiện ích đẳng cấp",
        riskScore: 12,
        agents: {
            legal: { score: 8, findings: [
                { text: "Pháp lý hoàn chỉnh, sổ hồng vĩnh viễn", positive: true },
                { text: "Khu đô thị quy hoạch bài bản", positive: true },
                { text: "Chủ đầu tư uy tín hàng đầu", positive: true }
            ]},
            market: { score: 15, findings: [
                { text: "Giá phù hợp phân khúc cao cấp", positive: true },
                { text: "Tăng giá ổn định, ít biến động", positive: true },
                { text: "Nhu cầu luôn cao từ giới thượng lưu", positive: true }
            ]},
            environment: { score: 10, findings: [
                { text: "Hệ thống thoát nước hiện đại", positive: true },
                { text: "Không gian xanh rộng lớn", positive: true },
                { text: "An ninh 24/7, hạ tầng đồng bộ", positive: true }
            ]},
            fraud: { score: 5, findings: [
                { text: "Giao dịch qua sàn chính thức", positive: true },
                { text: "Thông tin xác minh đa nguồn", positive: true },
                { text: "Không có dấu hiệu bất thường", positive: true }
            ]}
        }
    },
    {
        id: 8,
        name: "Đất thổ cư Hóc Môn",
        address: "Lê Thị Hà, Hóc Môn",
        lat: 10.8862,
        lng: 106.5910,
        price: "2.1 tỷ",
        priceNum: 2100,
        area: "80m²",
        type: "Đất thổ cư",
        bedrooms: 0,
        description: "Đất thổ cư mặt tiền hẻm xe hơi",
        riskScore: 55,
        agents: {
            legal: { score: 52, findings: [
                { text: "Sổ hồng nhưng đang thế chấp ngân hàng", negative: true },
                { text: "Hẻm nhỏ, không đủ lộ giới xây dựng", negative: true },
                { text: "Khu vực có khả năng bị giải tỏa", negative: true }
            ]},
            market: { score: 45, findings: [
                { text: "Giá cao hơn 15% so với thị trường", negative: true },
                { text: "Khu vực chậm phát triển", neutral: true },
                { text: "Thanh khoản trung bình", neutral: true }
            ]},
            environment: { score: 58, findings: [
                { text: "Hạ tầng giao thông chưa phát triển", negative: true },
                { text: "Thiếu tiện ích công cộng", negative: true },
                { text: "Nguy cơ ngập khi mưa lớn", negative: true }
            ]},
            fraud: { score: 35, findings: [
                { text: "Cần xác minh tình trạng thế chấp", neutral: true },
                { text: "Tin đăng thiếu thông tin chi tiết", negative: true },
                { text: "Giá không nhất quán giữa các nguồn", negative: true }
            ]}
        }
    },
    {
        id: 9,
        name: "Căn hộ The Sun Avenue",
        address: "28 Mai Chí Thọ, An Phú, TP Thủ Đức",
        lat: 10.7752,
        lng: 106.7518,
        price: "3.2 tỷ",
        priceNum: 3200,
        area: "73m²",
        type: "Căn hộ",
        bedrooms: 2,
        description: "Căn hộ tầng cao, view đẹp, full nội thất",
        riskScore: 20,
        agents: {
            legal: { score: 14, findings: [
                { text: "Sổ hồng vĩnh viễn, không tranh chấp", positive: true },
                { text: "Chủ đầu tư Novaland đã bàn giao", positive: true },
                { text: "Pháp lý minh bạch", positive: true }
            ]},
            market: { score: 25, findings: [
                { text: "Giá hợp lý khu Thủ Đức", positive: true },
                { text: "Gần trục Mai Chí Thọ phát triển", positive: true },
                { text: "Tăng giá 6-8%/năm", positive: true }
            ]},
            environment: { score: 18, findings: [
                { text: "Gần Metro, giao thông thuận tiện", positive: true },
                { text: "Không rủi ro ngập lụt", positive: true },
                { text: "Nhiều tiện ích xung quanh", positive: true }
            ]},
            fraud: { score: 10, findings: [
                { text: "Tin đăng xác thực", positive: true },
                { text: "Giá nhất quán các nguồn", positive: true },
                { text: "Lịch sử chủ sở hữu rõ ràng", positive: true }
            ]}
        }
    },
    {
        id: 10,
        name: "Nhà cấp 4 Bình Chánh",
        address: "Huyện Bình Chánh, TP.HCM",
        lat: 10.6815,
        lng: 106.6100,
        price: "1.2 tỷ",
        priceNum: 1200,
        area: "60m²",
        type: "Nhà cấp 4",
        bedrooms: 2,
        description: "Nhà cấp 4 hẻm đường lớn, gần chợ",
        riskScore: 68,
        agents: {
            legal: { score: 72, findings: [
                { text: "Đất xây dựng không phép", negative: true },
                { text: "Giấy tờ tay, chưa có sổ đỏ", negative: true },
                { text: "Khu vực đang kiểm tra vi phạm xây dựng", negative: true }
            ]},
            market: { score: 58, findings: [
                { text: "Giá hấp dẫn nhưng rủi ro pháp lý", neutral: true },
                { text: "Khu vực chậm phát triển hạ tầng", negative: true },
                { text: "Thanh khoản thấp do pháp lý", negative: true }
            ]},
            environment: { score: 75, findings: [
                { text: "Ngập nặng vào mùa mưa (vùng trũng)", negative: true },
                { text: "Đường sá lầy lội khi mưa", negative: true },
                { text: "Xa bệnh viện, trường học", negative: true }
            ]},
            fraud: { score: 40, findings: [
                { text: "Cần xác minh giấy tờ tay", negative: true },
                { text: "Nhiều vụ lừa đảo tại khu vực này", negative: true },
                { text: "Ảnh listing mờ, không rõ ràng", negative: true }
            ]}
        }
    },
    {
        id: 11,
        name: "Penthouse Landmark 81",
        address: "720A Điện Biên Phủ, Bình Thạnh",
        lat: 10.7952,
        lng: 106.7225,
        price: "65 tỷ",
        priceNum: 65000,
        area: "350m²",
        type: "Penthouse",
        bedrooms: 4,
        description: "Penthouse tầng cao nhất Đông Nam Á, nội thất siêu cao cấp",
        riskScore: 10,
        agents: {
            legal: { score: 8, findings: [
                { text: "Pháp lý hoàn chỉnh tuyệt đối", positive: true },
                { text: "Vingroup - chủ đầu tư số 1 VN", positive: true },
                { text: "Không rủi ro quy hoạch", positive: true }
            ]},
            market: { score: 12, findings: [
                { text: "Phân khúc ultra-luxury ổn định", positive: true },
                { text: "Giá trị tăng bền vững", positive: true },
                { text: "Khan hiếm nguồn cung", positive: true }
            ]},
            environment: { score: 8, findings: [
                { text: "Tòa nhà cao nhất VN - không ngập", positive: true },
                { text: "Tiện ích 5 sao đẳng cấp quốc tế", positive: true },
                { text: "View toàn cảnh thành phố", positive: true }
            ]},
            fraud: { score: 5, findings: [
                { text: "Giao dịch qua sàn chính thức Vinhomes", positive: true },
                { text: "Xác minh đa tầng", positive: true },
                { text: "Không dấu hiệu bất thường", positive: true }
            ]}
        }
    },
    {
        id: 12,
        name: "Shophouse Sala Đại Quang Minh",
        address: "Sala, Mai Chí Thọ, TP Thủ Đức",
        lat: 10.7705,
        lng: 106.7430,
        price: "28 tỷ",
        priceNum: 28000,
        area: "150m²",
        type: "Shophouse",
        bedrooms: 3,
        description: "Shophouse mặt tiền kinh doanh, khu đô thị Sala",
        riskScore: 22,
        agents: {
            legal: { score: 18, findings: [
                { text: "Sổ hồng vĩnh viễn, quy hoạch rõ ràng", positive: true },
                { text: "Khu đô thị Sala được phê duyệt đầy đủ", positive: true },
                { text: "Giấy phép kinh doanh OK", positive: true }
            ]},
            market: { score: 28, findings: [
                { text: "Giá cao nhưng phù hợp phân khúc", neutral: true },
                { text: "Khu vực đang phát triển mạnh", positive: true },
                { text: "Tiềm năng cho thuê tốt", positive: true }
            ]},
            environment: { score: 15, findings: [
                { text: "Hạ tầng hiện đại, đường rộng", positive: true },
                { text: "Hệ thống thoát nước tốt", positive: true },
                { text: "Gần Metro, các tuyến giao thông lớn", positive: true }
            ]},
            fraud: { score: 10, findings: [
                { text: "Chủ đầu tư uy tín", positive: true },
                { text: "Thông tin nhất quán", positive: true },
                { text: "Lịch sử giao dịch minh bạch", positive: true }
            ]}
        }
    },
    {
        id: 13,
        name: "Đất nền dự án ma Cần Giuộc",
        address: "Huyện Cần Giuộc, Long An",
        lat: 10.5911,
        lng: 106.6357,
        price: "650 triệu",
        priceNum: 650,
        area: "100m²",
        type: "Đất nền",
        bedrooms: 0,
        description: "Đất nền phân lô, cam kết sổ đỏ trong 6 tháng",
        riskScore: 92,
        agents: {
            legal: { score: 95, findings: [
                { text: "DỰ ÁN MA - không có giấy phép phân lô", negative: true },
                { text: "Đất nông nghiệp phân lô trái phép", negative: true },
                { text: "Chính quyền đã cảnh báo dự án này", negative: true }
            ]},
            market: { score: 88, findings: [
                { text: "Giá THẤP BẤT THƯỜNG - 6.5tr/m²", negative: true },
                { text: "Không có giao dịch hợp pháp", negative: true },
                { text: "Đầu cơ qua nhiều tầng trung gian", negative: true }
            ]},
            environment: { score: 85, findings: [
                { text: "Vùng ngập triều cường nghiêm trọng", negative: true },
                { text: "Không có đường, điện, nước", negative: true },
                { text: "Đất yếu, cần gia cố rất tốn kém", negative: true }
            ]},
            fraud: { score: 95, findings: [
                { text: "CẢNH BÁO: trùng mô hình lừa đảo phổ biến", negative: true },
                { text: "SĐT liên kết với 15 tin lừa đảo khác", negative: true },
                { text: "Ảnh 3D render giả mạo dự án hoàn thiện", negative: true }
            ]}
        }
    },
    {
        id: 14,
        name: "Căn hộ Saigon Pearl",
        address: "92 Nguyễn Hữu Cảnh, Bình Thạnh",
        lat: 10.7890,
        lng: 106.7180,
        price: "6.8 tỷ",
        priceNum: 6800,
        area: "95m²",
        type: "Căn hộ",
        bedrooms: 3,
        description: "Căn hộ view sông Sài Gòn, nội thất cao cấp",
        riskScore: 30,
        agents: {
            legal: { score: 22, findings: [
                { text: "Sổ hồng đầy đủ", positive: true },
                { text: "Một số căn đang bị kiện tụng dân sự", neutral: true },
                { text: "Quy hoạch ổn định", positive: true }
            ]},
            market: { score: 35, findings: [
                { text: "Giá cao hơn 8% so với trung bình", neutral: true },
                { text: "Tòa nhà đã cũ (~15 năm)", neutral: true },
                { text: "Vẫn duy trì giá tốt nhờ vị trí", positive: true }
            ]},
            environment: { score: 25, findings: [
                { text: "Ven sông - nguy cơ ngập nhẹ", neutral: true },
                { text: "Giao thông thuận tiện", positive: true },
                { text: "Tiện ích xung quanh phong phú", positive: true }
            ]},
            fraud: { score: 15, findings: [
                { text: "Chủ đầu tư SSG uy tín", positive: true },
                { text: "Tin đăng xác thực", positive: true },
                { text: "Cần kiểm tra kỹ hợp đồng cũ", neutral: true }
            ]}
        }
    },
    {
        id: 15,
        name: "Nhà xưởng Bình Dương",
        address: "KCN Mỹ Phước, Bến Cát, Bình Dương",
        lat: 11.1102,
        lng: 106.5820,
        price: "8.5 tỷ",
        priceNum: 8500,
        area: "1000m²",
        type: "Nhà xưởng",
        bedrooms: 0,
        description: "Nhà xưởng trong KCN, đã có sẵn hạ tầng",
        riskScore: 45,
        agents: {
            legal: { score: 42, findings: [
                { text: "Quyền thuê đất 50 năm, còn 28 năm", neutral: true },
                { text: "Giấy phép kinh doanh phù hợp ngành", positive: true },
                { text: "Cần gia hạn thuê đất sau 2054", neutral: true }
            ]},
            market: { score: 38, findings: [
                { text: "Giá thuê cạnh tranh so với khu vực", positive: true },
                { text: "KCN có tỷ lệ lấp đầy 85%", positive: true },
                { text: "Giá đất công nghiệp đang tăng", positive: true }
            ]},
            environment: { score: 50, findings: [
                { text: "KCN có hệ thống xử lý nước thải", positive: true },
                { text: "Gần xa lộ nhưng giao thông đông", neutral: true },
                { text: "Ô nhiễm tiếng ồn từ sản xuất", negative: true }
            ]},
            fraud: { score: 25, findings: [
                { text: "Giao dịch qua ban quản lý KCN", positive: true },
                { text: "Hợp đồng rõ ràng, công chứng", positive: true },
                { text: "Cần kiểm tra lịch sử sử dụng đất", neutral: true }
            ]}
        }
    }
];

// Fetch properties from backend API
async function loadProperties() {
    try {
        const res = await fetch('http://localhost:3000/api/properties');
        if (!res.ok) throw new Error('API error');
        PROPERTIES = await res.json();
        console.log(`📡 Loaded ${PROPERTIES.length} properties from API`);
    } catch (err) {
        console.warn('⚠️ Could not connect to API, using mock data:', err.message);
        PROPERTIES = MOCK_PROPERTIES;
    }
}

function getRiskLevel(score) {
    if (score <= 35) return 'low';
    if (score <= 65) return 'medium';
    return 'high';
}

// Utility: get risk label from score
function getRiskLabel(score) {
    if (score <= 35) return 'Thấp';
    if (score <= 65) return 'Trung bình';
    return 'Cao';
}

// Utility: format price display
function formatPrice(price) {
    return price;
}
