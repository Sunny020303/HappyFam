<a name="readme-top"></a>
<!-- PROJECT LOGO -->
<div align="center">
  <h1 align="center">HAPPYFAM</h1>

  <p align="center">
    Đây là 1 ứng dụng quản lý lịch sử các hoạt động của gia đình, sử dụng React Native và Supabase để xây dựng !
    <br />
    <a href="https://github.com/Sunny020303/HappyFam"><strong>Khám phá ứng dụng này »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Sunny020303/HappyFam">Xem demo</a>
    ·
    <a href="https://github.com/Sunny020303/HappyFam">Báo lỗi</a>
    ·
    <a href="https://github.com/Sunny020303/HappyFam">Yêu cầu tính năng</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Nội dung</summary>
  <ol>
    <li>
      <a href="#about-the-project">Về ứng dụng này</a>
      <ul>
        <li><a href="#built-with">Xây dựng với</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Bắt đầu sử dụng</a>
      <ul>
        <li><a href="#installation">Cài đặt</a></li>
      </ul>
    </li>
    <li><a href="#usage">Hướng dẫn sử dụng</a></li>
    <li><a href="#contact">Liên hệ</a></li>
    <li><a href="#acknowledgments">Nguồn tham khảo</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
<a name="about-the-project"></a>
## Về ứng dụng này
<div align="center">
<img src="/src/images/Dashboard.png" alt="Restaurant management application"/></div>
<p align="center"><i>Ứng dụng quản lý lịch sử các hoạt động của gia đình</i></p>

Trong bối cảnh công nghệ thông tin ngày càng phát triển mạnh mẽ, việc áp dụng các giải pháp công nghệ để cải thiện và nâng cao chất lượng cuộc sống là một xu hướng tất yếu. Đặc biệt, trong đời sống gia đình, việc quản lý thời gian và lưu trữ các kỷ niệm quý giá của từng thành viên đang trở nên quan trọng hơn bao giờ hết. Đáp ứng nhu cầu này, nhóm đã phát triển “Ứng dụng quản lý lịch sử các hoạt động của gia đình” với mong muốn mang đến một công cụ hữu ích, tiện lợi và hiệu quả cho các gia đình.

Dưới đây là mô tả chi tiết về các tính năng chính của ứng dụng:
1. Quản lý các hoạt động của gia đình
    * Thêm xóa sửa các hoạt động:
      * Các thành viên có thể Thêm/xóa/sửa các hoạt động của gia đình.
      * Xem thông tin chi tiết các hoạt động.
2. Quản lý các thành viên trong gia đình
    * Chủ của gia đình có thể quản lý các thành viên khác trong gia đình
3. Tạo nhắc nhở, hẹn lịch
    * Thêm nhắc nhở, nhắc hẹn cho các hoạt động của gia đình.
4. Thống kê các hoạt động
    * Xem thống kê các hoạt động của gia đình
5. Các chức năng tài khoản
    * Đăng ký đăng nhập, quản lý tài khoản

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Xây dựng với
<a name="built-with"></a>
### Frameworks và thư viện
<div align="center">
<img src="/src/images/JavaScript.png" height="100"/> 
<img src="/src/images/ReactNative.png" height="100"/> 
<img src="/src/images/Supabase.png" height="100"/> 
<img src="/src/images/Paper.png" height="100"/> 
</div>
<p align="center"><i>Những công nghệ sử dụng</i></p>


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
<a name="getting-started"></a>
## Bắt đầu sử dụng
Hướng dẫn cách cài đặt dự án về máy. Để có một bản sao ứng dụng có thể chạy được, làm theo những bước đơn giản sau đây:

### Cài đặt
<a name="installation"></a>
Để có thể chạy được ứng dụng, yêu cầu cài đặt những thứ sau:
* <a href="https://nodejs.org/en/download">Nodejs</a> và  <a href="https://code.visualstudio.com/download">Visual Studio Code</a>, để chạy mã nguồn

1. Đầu tiên, hãy clone dự án này về máy và mở bằng Visual Studio Code
2. Mở terminal và chạy lệnh 'npm install' để download các node_modules cần thiết
3. Chạy lệnh npm start để bắt đầu ứng dụng ở port 3000 và mở [http://localhost:3000](http://localhost:3000) trong trình duyệt
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Hướng dẫn sử dụng
<a name="usage"></a>
Có 7 màn hình chính, đăng nhập, đăng ký, lịch sử hoạt động, thông tin hoạt động, thêm/sửa hoạt động, Dashboard, quản lý gia đình.
1. Màn hình đăng nhập và đăng ký
   * Người dùng đăng nhập vào hệ thống với mật khẩu và tài khoản
   <img src="/src/images/Login.png"/>
   <p align="center"><i>Màn hình đăng nhập</i></p>
   
   * Tạo tài khoản mới
   <img src="/src/images/Register.png"/>
   <p align="center"><i>Màn hình đăng ký</i></p>
   
3. Màn hình lịch sử hoạt động
   * Giao diện lịch với các hoạt động đã tạo và được lưu trữ
   <img src="/src/images/Calendar.png"/>
   <p align="center"><i>Giao diện lịch sử hoạt động</i></p>
  
4. Màn hình thông tin hoạt động
   * Người dùng xem các thông tin chi tiết của hoạt động
   <img src="/src/images/ActivityView.png"/>
   <p align="center"><i>Giao diện thông tin hoạt động</i></p>
   
5. Màn hình thêm/sửa hoạt động
   * Thêm hoặc sửa các hoạt động
   <img src="/src/images/AddActivity.png"/>
   <p align="center"><i>Giao diện thêm/sửa hoạt động</i></p>
   
6. Màn hình Dashboard
   * Xem thông tin của gia đình và các chức năng của ứng dụng
   <img src="/src/images/Dashboard.png"/>
   <p align="center"><i>Giao diện Dashboard</i></p>
   
7. Màn hình quản lý gia đình
   * Quản lý các thành viên trong gia đình.
   <img src="/src/images/Family.png"/>
   <p align="center"><i>Giao diện quản lý gia đình</i></p>
     
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Liên hệ
<a name="contact"></a>
* Nguyễn Quốc Thái Dương - [Facebook](https://www.facebook.com/profile.php?id=100010982231797) - 21520758@gm.uit.edu.vn
* Phạm Bá Hoàng - [Facebook](https://www.facebook.com/kv7r2) - 21520872@gm.uit.edu.vn

Project Link: [HappyFam](https://github.com/Sunny020303/HappyFam)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Nguồn tài liệu tham khảo
<a name="acknowledgments"></a>
Đây là những nguồn tài liệu nhóm chúng mình đã sử dụng để có thể thực hiện được đồ án này!

* [Node.js](https://nodejs.org/en)
* [React](https://react.dev/)
* [React native](https://reactnative.dev/docs/getting-started)
* [Expo](https://docs.expo.dev/)
* [React native paper](https://reactnativepaper.com/)
* [Supabase | The Open Source Firebase Alternative](https://supabase.com/)
* [React Tutorial by W3School](https://www.w3schools.com/react/default.asp)
* [JavaScript Tutorial by W3School](https://www.w3schools.com/js/default.asp)


<p align="right">(<a href="#readme-top">back to top</a>)</p>
