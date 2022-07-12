/**
* @description	: 택배사에 송장을 등록할때 불편한 점을 보완한 스크립트입니다.
* @filename		: util.js
* @author		: 배서연(talk@kakao.one)
* @version		: 20220712-01
* @since		: 20220605-01
* @git			: https://github.com/bsy0317/script/blob/main/util.js
* @loader		: https://github.com/bsy0317/script/blob/main/load.js
*/


var autoFill = true;						//고객명 자동입력유무 (true=활성화/false=비활성화)
var __export_count = 1;						//출고번호 기본값
var content_header_title = getElementByXpath('//*[@id="__layout"]/div/main/div/section/header/h1');		//메뉴헤더 텍스트가 담긴부분
var customerDataArray = new Array();		//거래처관리에 등록시 담기는 고객정보 배열(거래처관리->저장->배열)

/*고객정보 구조체*/
function customerData(name, call, phone, postcode, address1, address2, sender){
	this.name = name;			//고객이름
	this.call = call;			//고객일반전화
	this.phone = phone;			//고객휴대폰번호
	this.postcode = postcode;	//고객우편번호
	this.address1 = address1;	//고객주소1
	this.address2 = address2;	//고객주소2
	this.sender = sender;		//송하인 ("이름,전화번호로 구성")
}
/*END*/

/*(private) 쿠키값 설정관련 함수*/
function setCookie(cookie_name, value, days) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + days);
	exdate.setHours(0,0,0);					//자정에 데이터만료
	var cookie_value = escape(value) + ((days == null) ? '' : '; expires=' + exdate.toUTCString());
	document.cookie = cookie_name + '=' + cookie_value;
}

/*쿠키값을 점검하여 등록하는 함수*/
function getExportCount(){
	// test 변수에 쿠키값 저장
	const test = document.cookie;
	// test 변수의 값인 string 을 '; '로 split 해준다
	// 세미콜론 뒤에 공백이 있는 이유는 쿠키값이 저렇게 생겨서이다
	arr1 = test.split('; ');
	// 배열을 하나 생성해주고
	arr2 = [];
	// arr1 배열의 값을 돌면서 '=' 로 한 번 더 split 해준다
	// arr2 배열은 배열 안에 배열이 들어있는 형태가 된다
	for (let i = 0; i < arr1.length; i++) {
		arr2.push(arr1[i].split('='));
	}
	// arr2 배열에서 nested 된 배열의 첫 번째 값이 "export_count" 인 값의 두 번째 값을 반환한다.
	for (let i = 0; i < arr2.length; i++) {
		if (arr2[i][0] === "export_count") {
			__export_count = Number(arr2[i][1]); //배열의 값을 현재 출고번호로 적용합니다.
			return __export_count;
		}
	}
	//만약 해당 쿠키가 존재하지 않는다면 "export_count":__export_count 쿠키를 기록합니다.
	setCookie("export_count", String(__export_count), 1);
}
/*END*/

/*HTML XPath를 이용하여 Element를 반환받는 함수*/
function getElementByXpath(path) { 
	return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
/*END*/

/*주소입력 모달이 열릴경우 주소입력창에 자동으로 포커스를 맞춤*/
function click_juso(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		console.log("juso.go.kr 모달 열림");
		let juso_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[13]/div/div/div[2]/div/div/div[2]/div/div/fieldset/input'); // input 태그 취득
		if(juso_input != null){
			juso_input.focus();
		}
	}
}
/*END*/

/*출력자료등록에서 내품명을 자동으로 입력해주는 함수*/
function writeProduct(){
		let item_name_input = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[1]/dl[1]/dd/div/input'); // 품목명 input Element 취득
		item_name_input.value="반건조생선,건어물 냉동보관필수 당일배송 부탁드립니다."; 	// 품목명 입력
		item_name_input.dispatchEvent(new Event('input'));			// 품목명 입력 이벤트 발생
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[1]/input').value="반건조생선";				//내품명 input Element 취득
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[3]/input').value="1";					//내품수량 input Element 취득
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input').value= __export_value;		//출고번호 input Element 취득
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[2]/dd/div/input').value= "냉동보관이 필요한 상품입니다.";	//특이사항 input Element 취득
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[2]/dl[1]/dd/div/div/input').value="속초웰빙반건조"			//발송인 이름 input Element 취득
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input').value="01053821766";		//발송인 번호 input Element 취득
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[3]/dl[1]/dd/div/div/input').focus();				//고객전화번호에 포커스를 맞춤
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[1]/input').dispatchEvent(new Event('input'));		//내품명 입력 이벤트 발생
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[3]/input').dispatchEvent(new Event('input'));		//내품수량 입력 이벤트 발생
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[3]/dl[1]/dd/div/div/input').dispatchEvent(new Event('input'));	//고객전화번호 입력 이벤트 발생
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input').dispatchEvent(new Event('input'));		//출고번호 입력 이벤트 발생
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[2]/dd/div/input').dispatchEvent(new Event('input'));			//특이사항 입력 이벤트 발생
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[2]/dl[1]/dd/div/div/input').dispatchEvent(new Event('input'));		//발송인 이름 입력 이벤트 발생
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input').dispatchEvent(new Event('input'));		//발송인 번호 입력 이벤트 발생
}
/*END*/

/*출력자료 등록시 필요한 내용 자동으로 입력*/
function click_submit(){
	if(content_header_title.innerText.indexOf('출력자료등록') != -1){
		let today = new Date();
		let year = today.getFullYear();
		let month = ('0' + (today.getMonth() + 1)).slice(-2);
		let day = ('0' + today.getDate()).slice(-2);
		__export_value = year+month+day+"-"+__export_count;		//20220624-01 과 같은 형식으로 출고번호를 만듭니다.
		setCookie("export_count", String(__export_count), 1); 	//현재까지의 출고번호를 쿠키에 저장합니다.
		
		writeProduct(); //내품명 자동입력 함수 호출
		
		let stack_pop_btn = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[3]/div/div[1]/button[2]'); 	//고객 불러오기 버튼 Element
		if(stack_pop_btn == null){								//고객 불러오기 버튼이 없을 경우 -> 아직 버튼이 안만들어짐
			btn = document.createElement('button');				//버튼 객체 생성
			btn.classList.add('el-button','button-default','el-button--default','el-button--medium');						//고객 불러오기 버튼에 style class 추가->디자인적용
			getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[3]/div/div[1]').appendChild(btn)	//인쇄설정 옆에 적용
			btn.textContent = customerDataArray.length <=0 ? '비어있음':'방금전 입력한 고객('+customerDataArray.length+'개 남음'+') 등록'; //만든 버튼 객체에 Text 설정
			btn.addEventListener('click',function(event){		//만든 버튼 객체에 클릭시 발생하는 이벤트 할당
				/*고객 불러오기 버튼 클릭시 일전에 등록한 거래처 명단 순차적으로 자동입력*/
				if(autoFill && customerDataArray.length > 0){ 	//고객명 자동입력유무가 True이고 고객데이터배열이 비어있지 않을경우
					let temp_data = customerDataArray.pop();	//고객데이터 배열에서 인출(스택)
					btn.textContent = customerDataArray.length <=0 ? '비어있음':'방금전 입력한 고객('+customerDataArray.length+'개 남음'+') 등록'; 	//줄어든 고객 수를 버튼에 반영
					
					/*고객우편번호 Element*/
					let postcode = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[1]/dl/dd/div/div[1]/div[1]/input');
					postcode.value=temp_data.postcode;
					
					/*주소1 Element*/
					let juso1 = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[1]/dl/dd/div/div[2]/div[1]/input');
					juso1.value=temp_data.address1;
					
					/*주소2 Element*/
					let juso2 = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[1]/dl/dd/div/div[2]/div[2]/input');
					juso2.value=temp_data.address2;
					
					/*고객이름 Element*/
					let name = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[2]/dl[1]/dd/div/div/input')
					name.value=temp_data.name;
					
					/*고객일반전화 Element*/
					let call = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[3]/dl[1]/dd/div/div/input');
					call.value=temp_data.call;
					
					/*고객휴대전화번호 Element*/
					let phone = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[3]/dl[2]/dd/div/input');
					phone.value=temp_data.phone;
					
					if(temp_data.sender != ","){						//발송인 데이터가 존재하는경우
						let split_data = temp_data.sender.split(','); 	// 메모1(발송자)칸의 ',' 기준으로 자름(보내는이 이름[0],전화번호[1])
						let sender_name = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[2]/dl[1]/dd/div/div/input');		//송하인 input Element
						sender_name.value=split_data[0];
						let sender_phone = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input');	//송하인전화번호 input Element
						sender_phone.value=split_data[1];
						sender_name.dispatchEvent(new Event('input'));
						sender_phone.dispatchEvent(new Event('input'));
						let item_name_input = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[1]/dl[1]/dd/div/input'); 	// 품목명 input Element 취득
						item_name_input.value="반건조생선,건어물 냉동보관필수 당일배송 부탁드립니다. 발송인:"+split_data[0]+"/"+split_data[1]; 	// 품목명에 발송인 기재
						item_name_input.dispatchEvent(new Event('input'));
					}else{		//발송인 데이터가 없는 경우, 기본값으로 리셋(없으면 이전 송하인 값이 계속 유지됨)
						let sender_name = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[2]/dl[1]/dd/div/div/input');
						sender_name.value="속초웰빙반건조";
						let sender_phone = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input');
						sender_phone.value="01053821766";
						sender_name.dispatchEvent(new Event('input'));
						sender_phone.dispatchEvent(new Event('input'));
					}
					
					/*고객정보 input들 입력 이벤트 발생*/
					postcode.dispatchEvent(new Event('input'));
					juso1.dispatchEvent(new Event('input'));
					juso2.dispatchEvent(new Event('input'));
					name.dispatchEvent(new Event('input'));
					call.dispatchEvent(new Event('input'));
					phone.dispatchEvent(new Event('input'));
					/*END*/
				}
				writeProduct(); //내품명 자동입력 함수 호출
				//__export_count = __export_count + 1;  //출고번호 카운트
			});
		}else{
			//고객정보배열이 비어있는경우 '비어있음' 버튼으로, 비어있지는 않지만 아직 클릭하기 전이라면 정상출력
			btn.textContent = customerDataArray.length <=0 ? '비어있음':'방금전 입력한 고객('+customerDataArray.length+'개 남음'+') 등록';
		}
		
		//발송인 수동 초기화 버튼 Element
		let reset_sender_btn = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[3]/div/div[1]/button[3]');
		if(reset_sender_btn == null){	//위에서 XPath가 null인경우 -> 아직 버튼이 안만들어짐
			let btn2 = document.createElement('button');
			btn2.classList.add('el-button','button-default','el-button--default','el-button--medium');
			btn2.textContent = '내품명,발송인 자동입력';
			getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[3]/div/div[1]').appendChild(btn2)
			btn2.addEventListener('click',function(event){
				/* 발송인 입력 */
				let sender_name = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[2]/dl[1]/dd/div/div/input');
				sender_name.value="속초웰빙반건조";
				let sender_phone = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input');
				sender_phone.value="01053821766";
				sender_name.dispatchEvent(new Event('input'));
				sender_phone.dispatchEvent(new Event('input'));
				/* 발송인 입력 종료 */
				writeProduct();
			});
		}
		
		/*  저장->확인 버튼을 클릭시 고객정보와 발송인을 자동으로 채우도록 이벤트를 등록함*/
		let confirm_btn_listen = getElementByXpath('/html/body/div[4]/div/div[3]/button[2]');				//저장 확인버튼 Element
		let cancle_btn_listen = getElementByXpath('/html/body/div[4]/div/div[3]/button[1]');			//저장 취소버튼 Element
		if(confirm_btn_listen != null) confirm_btn_listen.addEventListener('click', writeProduct);
		if(cancle_btn_listen != null) cancle_btn_listen.addEventListener('click', writeProduct);
		if(confirm_btn_listen != null) confirm_btn_listen.addEventListener('click', function(event){
			__export_count = __export_count + 1;	//출고번호 +1
		});
		if(cancle_btn_listen != null) cancle_btn_listen.addEventListener('click', function(event){
			__export_count = __export_count + 1;	//출고번호 +1
		});
		/*END*/
	}
}
/*END*/

/*거래처등록시 전화번호(일반전화)칸에 입력되는 내용을 자동으로 휴대폰번호로 복사*/
function number_autocopy(){
	//전화번호 input Element
	let local_num_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[9]/div/div/input');
	//휴대폰번호 input Element
	let phone_num_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[11]/div/div/input');
	phone_num_input.value = local_num_input.value;
	phone_num_input.dispatchEvent(new Event('input')); //입력이벤트 발생
	
}
/*END*/

/*신규행 추가시 '상호/이름'input 에 자동으로 포커스를 맞춤*/
function new_row_autofocus(){
	//최상단 '상호/이름'input Element
	let toprow_namw_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[7]/div/div/input');
	toprow_namw_input.focus();
}
/*END*/

/*메뉴헤더 텍스트를 주기적으로 가져오는 함수와, 지속적인 호출이 필요한 함수를 관리(마우스가 브라우저 내에서 움직일때마다 호출됨)*/
/*각 이벤트 등록함수마다 check_header_title가 지정된 내용과 틀리면 이벤트가 등록되지 않기 때문에 지속적으로 호출하여 등록되도록 해야함*/
function check_header_title(){
	content_header_title = getElementByXpath('/html/body/div[1]/div/div/main/div/section/header/h1');
	if(content_header_title == null){							//메뉴헤더 텍스트 Element가 null객체이면 오류가 발생하니 if문으로 분기
		content_header_title = getElementByXpath('/html');		//Element를 임시할당하여 오류없앰
	}else{														//content_header_title이 null이 아닌경우->정상적인 페이지인경우
		management_number_listen();		//거래처관리 등록시 관리번호를 자동으로 입력 함수
		Table_Edit_listen();			//거래처관리 테이블 수정 함수
		data_regist_autoinput();		//'click_submit' 이벤트 등록 함수
		phone_num_autocopy();			//'number_autocopy' 이벤트 등록 함수
		phone_num_tab_listen();			//휴대폰번호 Input Element에서 Tab 입력시 자동으로 주소입력 창 열리게 하는 함수
		new_rowbtn_listen();			//'new_row_autofocus' 이벤트 등록 함수
		submit_juso_enter();			//고객정보 배열에 저장하는 함수
	}
}
/*END*/

/*거래처관리 등록 Table에서 메모1, 메모2를 보낸이 이름, 번호로 바꾸는 함수*/
function Table_Edit_listen(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		var header1 = getElementByXpath('/html/body/div/div/div/main/div/section/div[2]/div[2]/div[1]/div[2]/table/thead/tr/th[16]/div'); //메모1 th Element
		var header2 = getElementByXpath('/html/body/div/div/div/main/div/section/div[2]/div[2]/div[1]/div[2]/table/thead/tr/th[17]/div'); //메모2 th Element
		if(header1 != null && header2 != null){			//거래처관리 등록 테이블이 보인다면
			header1.innerText = "발송인 이름";				//메모1->발송인 이름
			header2.innerText = "발송인 번호";				//메모2->발송인 번호
			header1.dispatchEvent(new Event('input'));	//이벤트 호출
			header2.dispatchEvent(new Event('input'));	//이벤트 호출
		}
	}
}
/*END*/

/*거래처관리 등록시 관리번호를 자동으로 입력함*/
function management_number_listen(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		//관리번호 input Element
		var management_number_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[6]/div/div/input');
		if(management_number_input != null){
			let today = new Date();
			let year = today.getFullYear();
			let month = ('0' + (today.getMonth() + 1)).slice(-2);
			let day = ('0' + today.getDate()).slice(-2);
			management_number_input.value = year+month+day;		//20220719 형식으로 입력
			management_number_input.dispatchEvent(new Event('input'));
		}
	}
}

/*거래처 관리->고객정보들 입력->저장버튼 클릭시 고객정보 배열에 저장하는 함수*/
function submit_juso_enter(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		let save_btn = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[3]/div/button[2]');	//저장버튼 Element
		if(save_btn != null){
			save_btn.addEventListener('click',function(event){
				//<tbody> Tag 밑 <tr>(TABLE ROW) 데이터가 담김
				let table_body=document.evaluate('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.children;
				customerDataArray.length=0;					//이전에 저장된 정보 리셋->저장버튼을 클릭할때마다 지워버림
				for(var i=0; i<table_body.length; i++){		//<tr>(TABLE ROW) 데이터 수량만큼 반복
					let table_row=table_body[i].getElementsByClassName('el-input__inner');	//특정 Style Class를 가지고 있는 요소만 추출-><tr>태그만 남음
					let temp_array=new Array();				//고객정보가 담길 임시배열
					for(var j=0; j<table_row.length; j++){	//<tr>(TABLE ROW) 내부 데이터 만큼 반복
						let table_col=table_row[j].value;	//<tr>(TABLE ROW) 내부 데이터
						temp_array.push(table_col);			//임시배열에 입력(스택)
					}
					customerDataArray.push(new customerData(temp_array[1], temp_array[3], temp_array[5], temp_array[7], temp_array[8], temp_array[9], temp_array[11]+","+temp_array[12]));
				}
			});
		}
	}
}
/*END*/

/* 각 함수별 EventListner 선언부분*/
function data_regist_autoinput(){		//function 'click_submit' 이벤트 등록용 함수
	if(content_header_title.innerText.indexOf('출력자료등록') != -1){
		let submit_input_listen = getElementByXpath('/html/body/div/div/div/main/div/section/div[1]/div[1]/button');	//단건입력 버튼 Element
		submit_input_listen.addEventListener('click', click_submit);	//버튼 클릭시에 'click_submit' 함수 호출
	}
}

function phone_num_autocopy(){			//function 'number_autocopy' 이벤트 등록용 함수
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		//전화번호 Element
		let local_num_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[9]/div/div/input');
		if(local_num_input != null){
			local_num_input.addEventListener('input', number_autocopy);	//키보드로 입력시에 이벤트 호출
		}
	}
}

function phone_num_tab_listen(){		//휴대폰번호 Element에서 Tab 입력시 자동으로 주소입력 창 열림
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		let phone_num_input = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[12]/div/div/input');
		if(phone_num_input != null){
			phone_num_input.addEventListener('keydown',function(event){
				if(event.keyCode == 9){		//Tab 키코드
					event.preventDefault();	//이전에 있던 키 입력 이벤트 삭제
					//주소검색 버튼 Element
					let juso_input_listen = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr/td[13]/div/div/div[2]/button');
					juso_input_listen.click();	//주소검색 버튼 클릭
					click_juso();				//주소입력에 포커스 맞춰주는 함수 호출
				}
			});
		}
	}
}

function new_rowbtn_listen(){		//function 'new_row_autofocus' 이벤트 등록용 함수 (거래처관리에서 '신규행 추가' 버튼 클릭시)
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		let new_rowbtn = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[1]/div[2]/button[1]'); //신규행 추가 버튼 Element
		if(new_rowbtn != null){
			new_rowbtn.addEventListener('click', new_row_autofocus);
		}
	}
}

function main_listner_create(){		//function 'check_header_title' 이벤트 등록용 함수 (마우스가 움직일때마다 호출)
	let body_listen = getElementByXpath('/html/body');
	body_listen.addEventListener('mouseover', check_header_title);	//마우스가 움직일때 호출
}

/*스크립트가 실행중임을 보이는 코드*/
function domReady() {
	document.addEventListener("readystatechange", () => {
		if (document.readyState == 'complete') {		//요소가 모두 로딩된경우
			setTimeout(function () {	//1초간 대기 후 실행
				var footer_element = document.evaluate('//*[@id="footer"]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				if(footer_element != null){
					footer_element.innerHTML = '<b style="color:#ff0000;">[CUSTOM MODE ENABLED]</b> &nbsp'+footer_element.innerText;
				}
			},1000);
		}
	});
}
/*END*/

/*메인함수*/
function main(){	
	getExportCount();			//쿠키값을 점검하여 등록하는 함수 -> 출고번호를 관리하는 변수가 먼저 불러와져야 함
	domReady();					//Footer에 [CUSTOM MODE ENABLED] 추가하는 함수
	main_listner_create();		//'check_header_title' 함수 호출 -> 전체적인 EventListner를 호출하며 관리함
}

main(); //코드 실행