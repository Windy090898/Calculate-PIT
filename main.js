// Cái này là hàm có thể xài đi xài lại nên để lên trên thui hong có gì
function domID(id) {
    return document.getElementById(id)
}


// Hàm check khi input, nếu không đúng định dạng số khi nhập thì trả lỗi ngay lúc nhập
function checkNumberInput(item) {
    item.oninput = function() {
        
        // Reset lại trường báo lỗi nếu nhập đúng
        document.getElementById(item.id + 'Error').innerHTML = ""
        item.style.borderColor = ''

        // Nếu nhập kí tự không phải số -> NaN -> Báo lỗi, tô đỏ cái viền ô nhập (để ngựa ngựa)
        if (isNaN(Number(item.value))) {
            document.getElementById(item.id + 'Error').innerHTML = "Vui lòng nhập đúng định dạng số"
            item.style.borderColor = 'red'
        }
    }
}


var name = domID('name')
var totalRevenue = domID('totalRevenue')
var dependent = domID('dependent')
var result = domID('result')
var btn = document.querySelector('.btn')

// Sử dụng hàm phía trên để check input của revenue và dependent, name thì maybe cần check (tên có chứa số không, độ dài chuỗi ???)
// KHÔNG TIN BẤT CỨ THỨ GÌ USER NHẬP VÀO
checkNumberInput(totalRevenue);
checkNumberInput(dependent);

// Đoạn dưới này sẽ tạo ra 1 khung cho bảng thuế, nếu như có thay đổi mức thu nhập tính thuế hay % thuế thì chỉ cần đổi 1 lần

/* Tạo ra 1 object mẫu, tái sử dụng nhiều lần, thay vì cho mỗi bậc là phải tạo như :
Bac1 {
    rev: 60,
    percentPIT: 0.05
}
Bac2 {
    .... lười lắm
}
*/
function revPIT(rev, percentPIT) {
    this.rev = rev,
    this.percentPIT = percentPIT;
}

// Tạo ra 1 list chứa từng bậc thu nhập tương ứng với mức thuế
const PITList = [
    new revPIT(60, 0.05),
    new revPIT(120, 0.1),
    new revPIT(210, 0.15),
    new revPIT(384, 0.2),
    new revPIT(624, 0.25),
    new revPIT(960, 0.3),
    new revPIT(20000000, 0.35),
]

// Khi click btn -> Tính thuế -> Trả kết quả
// toLocaleString() để định dạng số thành dạng 200,000 (cho xinh đẹp tuyệt vời)
btn.onclick = function() {
    var res = calPIT().toLocaleString();
    result.innerHTML = "Số thuế phải đóng: " + res
}

/**Tính thuế bằng cách:
 * Lấy giá trị rev (rev chia cho 1000000 tại làm biếng viết nhiều số 0 ở trên cái list), số người phụ thuộc
 * Tính thu nhập chịu thuế (pitRev): Thu nhập chịu thuế = Tổng thu nhập năm - 4tr- Số người phụ thuộc * 1.6tr
 * Lặp qua cái list thuế:
 *       Nếu pitRev nhỏ hơn mức thu nhập bậc 1 (60) => lấy pitRev đó, không thì lấy 60 (tương đương với item.rev)
 *       Tính số thuế phải đóng += thu nhập lấy ở trên * phần trăm thuế tương ứng
 *       Lấy pitRev ban đầu trừ rev đã đóng thuế -> gán lại vô thu nhập chịu thuế để chạy vòng lặp
 *       Nếu pitRev <=0 thì dừng, trả về số thuế phải đóng (giờ * 1000000 lại để trả về đơn vị triệu)
 */
function calPIT() {
    var rev = Number(totalRevenue.value) / 1000000;
    var noOfDepend = Number(dependent.value);
    var pitRev = rev - 4 - (noOfDepend * 1.6);

    var PITAmount = 0;

    for (var item of PITList) {
        var paidRev = pitRev < item.rev ? pitRev : item.rev;
        PITAmount += paidRev * item.percentPIT;
        pitRev -= paidRev

        if (pitRev <= 0) return Math.round(PITAmount * 1000000);
    }
}