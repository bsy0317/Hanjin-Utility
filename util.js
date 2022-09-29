/**
* @description	: 택배사에 송장을 등록할때 불편한 점을 보완한 스크립트입니다.
* @filename		: util.js
* @author		: 배서연(talk@kakao.one)
* @version		: 20220929-01
* @since		: 20220605-01
* @git			: https://github.com/bsy0317/script/blob/main/util.js
* @loader		: https://github.com/bsy0317/script/blob/main/load.js
*/


var version = "20220929-01";				//스크립트 버전정보
var version_check_ignore = false;			//업데이트 확인 무시
var autoFill = true;						//고객명 자동입력유무 (true=활성화/false=비활성화)
var __export_count = 1;						//출고번호 기본값
var __export_value = "";					//출고번호 Message
var content_header_title = document.getElementsByClassName('content-header-title')[0];		//메뉴헤더 텍스트가 담긴부분
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

/*비동기 대기 함수*/
function sleep(sec) {
	return new Promise(resolve => setTimeout(resolve, sec * 1000));
}
/*END*/

/*주소입력 모달이 열릴경우 주소입력창에 자동으로 포커스를 맞춤*/
function click_juso(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		console.log("juso.go.kr 모달 열림");
		let juso_input = document.querySelector('table > tbody > tr > td.el-table_1_column_13.table-form-td.label-required.el-table__cell > div > div > div.lh_normal > div > div > div.el-dialog__body > div > div > fieldset > input');
		if(juso_input != null){
			juso_input.focus();
		}
	}
}
/*END*/

/*출력자료등록에서 내품명을 자동으로 입력해주는 함수*/
function writeProduct(){
		let item_name_input = document.querySelector('div > div > div:nth-child(1) > dl:nth-child(1) > dd > div > input');
		item_name_input.value="반건조생선,건어물 냉동보관필수 당일배송 부탁드립니다."; 	// 품목명 입력
		item_name_input.dispatchEvent(new Event('input'));			// 품목명 입력 이벤트 발생
		
		document.querySelector('div > div > div:nth-child(2) > dl > dd > div > div.control-products-1.el-input.el-input--medium > input').value="반건조생선";	//내품명 input Element 취득
		document.querySelector('div > div > div:nth-child(2) > dl > dd > div > div.control-products-3.el-input.el-input--medium > input').value="1";		//내품수량 input Element 취득
		document.querySelector('div > div > div:nth-child(3) > dl:nth-child(1) > dd > div > div > input').value= __export_value;		//출고번호 input Element 취득
		document.querySelector('div > div > div:nth-child(3) > dl:nth-child(2) > dd > div > input').value= "냉동보관이 필요한 상품입니다.";	//특이사항 input Element 취득
		document.querySelector('div > div > div:nth-child(2) > dl:nth-child(1) > dd > div > div > input').value="속초웰빙반건조"			//발송인 이름 input Element 취득
		document.querySelector('div > div > div:nth-child(3) > dl:nth-child(1) > dd > div > div > input').value="01053821766";		//발송인 번호 input Element 취득
		document.querySelector('div > div > div:nth-child(2) > dl > dd > div > div.control-products-1.el-input.el-input--medium > input').dispatchEvent(new Event('input'));		//내품명 입력 이벤트 발생
		document.querySelector('div > div > div:nth-child(2) > dl > dd > div > div.control-products-3.el-input.el-input--medium > input').dispatchEvent(new Event('input'));		//내품수량 입력 이벤트 발생
		document.querySelector('div > div.table-vertical > div:nth-child(3) > dl:nth-child(1) > dd > div > div > input').dispatchEvent(new Event('input'));	//고객전화번호 입력 이벤트 발생
		document.querySelector('div > div > div:nth-child(3) > dl:nth-child(1) > dd > div > div > input').dispatchEvent(new Event('input'));		//출고번호 입력 이벤트 발생
		document.querySelector('div > div > div:nth-child(3) > dl:nth-child(2) > dd > div > input').dispatchEvent(new Event('input'));			//특이사항 입력 이벤트 발생
		document.querySelector('div > div > div:nth-child(2) > dl:nth-child(1) > dd > div > div > input').dispatchEvent(new Event('input'));		//발송인 이름 입력 이벤트 발생
		document.querySelector('div > div > div:nth-child(3) > dl:nth-child(1) > dd > div > div > input').dispatchEvent(new Event('input'));		//발송인 번호 입력 이벤트 발생
}
/*END*/

/*출력자료 등록시 필요한 내용 자동으로 입력*/
async function click_submit(){
	if(content_header_title.innerText.indexOf('출력자료등록') != -1){
		await sleep(2);		//모달이 로딩될 때 까지 대기함
		/*고객우편번호 Element*/
		let postcode = document.querySelector('div > div.table-vertical > div:nth-child(1) > dl > dd > div > div.control-address-wrap__zipcode > div.el-input.el-input--medium > input');
		
		/*주소1 Element*/
		let juso1 = document.querySelector('div > div.table-vertical > div:nth-child(1) > dl > dd > div > div.control-address-wrap__address > div.width-40p.el-input.el-input--medium > input');
		
		/*주소2 Element*/
		let juso2 = document.querySelector('div > div.table-vertical > div:nth-child(1) > dl > dd > div > div.control-address-wrap__address > div.width-60p.el-input.el-input--medium > input');
		
		/*고객이름 Element*/
		let name = document.querySelector('div > div.table-vertical > div:nth-child(2) > dl:nth-child(1) > dd > div > div > input');
		
		/*고객일반전화 Element*/
		let call = document.querySelector('div > div.table-vertical > div:nth-child(3) > dl:nth-child(1) > dd > div > div > input');
		
		/*고객휴대전화번호 Element*/
		let phone = document.querySelector('div > div.table-vertical > div:nth-child(3) > dl:nth-child(2) > dd > div > input');
		
		/*발송인 이름 Element*/
		let sender_name = document.querySelector('div > div > div:nth-child(2) > dl:nth-child(1) > dd > div > div > input');
		
		/*발송인 전화번호 Element*/
		let sender_phone = document.querySelector('div > div > div:nth-child(3) > dl:nth-child(1) > dd > div > div > input');
		
		/*출고물품 Element*/
		let item_name_input = document.querySelector('div > div > div:nth-child(1) > dl:nth-child(1) > dd > div > input');

		let today = new Date();
		let year = today.getFullYear();
		let month = ('0' + (today.getMonth() + 1)).slice(-2);
		let day = ('0' + today.getDate()).slice(-2);
		__export_value = year+month+day+"-"+__export_count;		//20220624-01 과 같은 형식으로 출고번호를 만듭니다.
		setCookie("export_count", String(__export_count), 1); 	//현재까지의 출고번호를 쿠키에 저장합니다.
		
		writeProduct(); //내품명 자동입력 함수 호출
		
		let stack_pop_btn = document.querySelector('#__layout > div > main > div > section > div:nth-child(3) > div > div.el-dialog__footer > div > div.buttons.is-flex-left > button:nth-child(2)');
		if(stack_pop_btn == null){								//고객 불러오기 버튼이 없을 경우 -> 아직 버튼이 안만들어짐
			btn = document.createElement('button');				//버튼 객체 생성
			btn.classList.add('el-button','button-default','el-button--default','el-button--medium');						//고객 불러오기 버튼에 style class 추가->디자인적용
			document.querySelector('#__layout > div > main > div > section > div:nth-child(3) > div > div.el-dialog__footer > div > div.buttons.is-flex-left').appendChild(btn)	//인쇄설정 옆에 적용
			btn.textContent = customerDataArray.length <=0 ? '비어있음':'방금전 입력한 고객('+customerDataArray.length+'개 남음'+') 등록'; //만든 버튼 객체에 Text 설정
			btn.addEventListener('click',function(event){				//만든 버튼 객체에 클릭시 발생하는 이벤트 할당
				writeProduct(); //내품명 자동입력 함수 호출
				__export_value = year+month+day+"-"+__export_count;		//20220624-01 과 같은 형식으로 출고번호를 만듭니다.
				/*고객 불러오기 버튼 클릭시 일전에 등록한 거래처 명단 순차적으로 자동입력*/
				if(autoFill && customerDataArray.length > 0){ 	//고객명 자동입력유무가 True이고 고객데이터배열이 비어있지 않을경우
					let temp_data = customerDataArray.pop();	//고객데이터 배열에서 인출(스택)

					postcode.value=temp_data.postcode;
					juso1.value=temp_data.address1;
					juso2.value=temp_data.address2;
					name.value=temp_data.name;
					call.value=temp_data.call;
					phone.value=temp_data.phone;

					btn.textContent = customerDataArray.length <=0 ? '비어있음':'방금전 입력한 고객('+customerDataArray.length+'개 남음'+') 등록'; 	//줄어든 고객 수를 버튼에 반영
					
					if(temp_data.sender != ","){						//발송인 데이터가 존재하는경우
						let split_data = temp_data.sender.split(','); 	// 메모1(발송자)칸의 ',' 기준으로 자름(보내는이 이름[0],전화번호[1])
						sender_name.value=split_data[0];
						sender_phone.value=split_data[1];
						sender_name.dispatchEvent(new Event('input'));
						sender_phone.dispatchEvent(new Event('input'));
						item_name_input.value="반건조생선,건어물 냉동보관필수 당일배송 부탁드립니다. 발송인:"+split_data[0]+"/"+split_data[1]; 	// 품목명에 발송인 기재
						item_name_input.dispatchEvent(new Event('input'));
					}else{		//발송인 데이터가 없는 경우, 기본값으로 리셋(없으면 이전 송하인 값이 계속 유지됨)
						sender_name.value="속초웰빙반건조";
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
				//__export_count = __export_count + 1;  //출고번호 카운트
			});
		}else{
			//고객정보배열이 비어있는경우 '비어있음' 버튼으로, 비어있지는 않지만 아직 클릭하기 전이라면 정상출력
			btn.textContent = customerDataArray.length <=0 ? '비어있음':'방금전 입력한 고객('+customerDataArray.length+'개 남음'+') 등록';
		}
		
		//발송인 수동 초기화 버튼 Element
		let reset_sender_btn = document.querySelector('#__layout > div > main > div > section > div:nth-child(3) > div > div.el-dialog__footer > div > div.buttons.is-flex-left > button:nth-child(3)');
		if(reset_sender_btn == null){	//위에서 XPath가 null인경우 -> 아직 버튼이 안만들어짐
			let btn2 = document.createElement('button');
			btn2.classList.add('el-button','button-default','el-button--default','el-button--medium');
			btn2.textContent = '내품명,발송인 자동입력';
			document.querySelector('#__layout > div > main > div > section > div:nth-child(3) > div > div.el-dialog__footer > div > div.buttons.is-flex-left').appendChild(btn2);		//자동입력 버튼 추가
			btn2.addEventListener('click',function(event){
				/* 발송인 입력 */
				sender_name.value="속초웰빙반건조";
				sender_phone.value="01053821766";
				sender_name.dispatchEvent(new Event('input'));
				sender_phone.dispatchEvent(new Event('input'));
				/* 발송인 입력 종료 */
				writeProduct();
			});
		}
		
		/* 저장->확인 버튼을 클릭시 고객정보와 발송인을 자동으로 채우도록 이벤트를 등록함*/
		let confirm_btn_listen = document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button:nth-child(2)");				//저장 확인버튼 Element
		let cancle_btn_listen = document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button:nth-child(1)");			//저장 취소버튼 Element
		if(confirm_btn_listen != null) confirm_btn_listen.addEventListener('click', function(event){
			__export_count = __export_count + 1;	//출고번호 +1
			writeProduct();
		});
		if(cancle_btn_listen != null) cancle_btn_listen.addEventListener('click', function(event){
			writeProduct();
		});
		/*END*/
	}
}
/*END*/

/*거래처등록시 전화번호(일반전화)칸에 입력되는 내용을 자동으로 휴대폰번호로 복사*/
function number_autocopy(){
	//전화번호 input Element
	let local_num_input = document.querySelector('table > tbody > tr > td.el-table_1_column_9.table-form-td.label-required.el-table__cell > div > div > input');
	//휴대폰번호 input Element
	let phone_num_input = document.querySelector('table > tbody > tr > td.el-table_1_column_11.table-form-td.el-table__cell > div > div > input');
	phone_num_input.value = local_num_input.value;
	phone_num_input.dispatchEvent(new Event('input')); //입력이벤트 발생
	
}
/*END*/

/*신규행 추가시 '상호/이름'input 에 자동으로 포커스를 맞춤*/
function new_row_autofocus(){
	//최상단 '상호/이름'input Element
	let toprow_namw_input = document.querySelector('table > tbody > tr > td.el-table_1_column_7.table-form-td.label-required.el-table__cell > div > div > input');
	toprow_namw_input.focus();
}
/*END*/

/*메뉴헤더 텍스트를 주기적으로 가져오는 함수와, 지속적인 호출이 필요한 함수를 관리(마우스가 브라우저 내에서 움직일때마다 호출됨)*/
/*각 이벤트 등록함수마다 check_header_title가 지정된 내용과 틀리면 이벤트가 등록되지 않기 때문에 지속적으로 호출하여 등록되도록 해야함*/
function check_header_title(){
	content_header_title = document.getElementsByClassName('content-header-title')[0];
	if(content_header_title == null){							//메뉴헤더 텍스트 Element가 null객체이면 오류가 발생하니 if문으로 분기
		content_header_title = document.getElementsByClassName('icon icon-tab-home')[0];
	}
	management_number_listen();		//거래처관리 등록시 관리번호를 자동으로 입력 함수
	Table_Edit_listen();			//거래처관리 테이블 수정 함수
	data_regist_autoinput();		//'click_submit' 이벤트 등록 함수
	phone_num_autocopy();			//'number_autocopy' 이벤트 등록 함수
	phone_num_tab_listen();			//휴대폰번호 Input Element에서 Tab 입력시 자동으로 주소입력 창 열리게 하는 함수
	new_rowbtn_listen();			//'new_row_autofocus' 이벤트 등록 함수
	submit_juso_enter();			//고객정보 배열에 저장하는 함수
	
}
/*END*/

/*거래처관리 등록 Table에서 메모1, 메모2를 보낸이 이름, 번호로 바꾸는 함수*/
function Table_Edit_listen(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		var header1 = document.querySelector('#__layout > div > main > div > section > div.resize-wrapper > div.content-container.resizable > div.content-result-table.grid-fixed > div.el-table.el-table--fit.el-table--scrollable-x.el-table--enable-row-hover.el-table--enable-row-transition.el-table--medium > div.el-table__header-wrapper > table > thead > tr > th.el-table_1_column_16.table-form-td.is-leaf.el-table__cell > div'); //메모1 th Element
		var header2 = document.querySelector('#__layout > div > main > div > section > div.resize-wrapper > div.content-container.resizable > div.content-result-table.grid-fixed > div.el-table.el-table--fit.el-table--scrollable-x.el-table--enable-row-hover.el-table--enable-row-transition.el-table--medium > div.el-table__header-wrapper > table > thead > tr > th.el-table_1_column_17.table-form-td.is-leaf.el-table__cell > div'); //메모2 th Element
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
		var management_number_input = document.querySelector('table > tbody > tr > td.el-table_1_column_6.table-form-td.el-table__cell > div > div > input');
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
		let save_btn = document.querySelector('#__layout > div > main > div > section > div.resize-wrapper > div.content-footer.is-flex-right > div > button:nth-child(2)');	//저장버튼 Element
		if(save_btn != null){
			save_btn.addEventListener('click',function(event){
				//<tbody> Tag 밑 <tr>(TABLE ROW) 데이터가 담김
				let table_body=document.querySelector('table > tbody').children;
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
		let submit_input_listen = document.querySelector('#__layout > div > main > div > section > div.resize-wrapper > div.content-header-buttons > div.buttons.is-flex-left > button');	//단건입력 버튼 Element
		submit_input_listen.addEventListener('click', click_submit);	//버튼 클릭시에 'click_submit' 함수 호출
	}
}

function phone_num_autocopy(){			//function 'number_autocopy' 이벤트 등록용 함수
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		//전화번호 Element
		let local_num_input = document.querySelector('table > tbody > tr:nth-child(1) > td.el-table_1_column_9.table-form-td.label-required.el-table__cell > div > div > input');
		if(local_num_input != null){
			local_num_input.addEventListener('input', number_autocopy);	//키보드로 입력시에 이벤트 호출
		}
	}
}

function phone_num_tab_listen(){		//휴대폰번호 Element에서 Tab 입력시 자동으로 주소입력 창 열림
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		let phone_num_input = document.querySelector('table > tbody > tr > td.el-table_1_column_11.table-form-td.el-table__cell > div > div > input');
		if(phone_num_input != null){
			phone_num_input.addEventListener('keydown',function(event){
				if(event.keyCode == 9){		//Tab 키코드
					event.preventDefault();	//이전에 있던 키 입력 이벤트 삭제
					//주소검색 버튼 Element
					let juso_input_listen = document.querySelector('table > tbody > tr:nth-child(1) > td.el-table_1_column_13.table-form-td.label-required.el-table__cell > div > div > div.lh_normal > button');
					juso_input_listen.click();	//주소검색 버튼 클릭
					click_juso();				//주소입력에 포커스 맞춰주는 함수 호출
				}
			});
		}
	}
}

function new_rowbtn_listen(){		//function 'new_row_autofocus' 이벤트 등록용 함수 (거래처관리에서 '신규행 추가' 버튼 클릭시)
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		let new_rowbtn = document.querySelector('#__layout > div > main > div > section > div.resize-wrapper > div.content-container.resizable > div.content-result-header > div.flex-right > button:nth-child(2)');
		if(new_rowbtn != null){
			new_rowbtn.addEventListener('click', new_row_autofocus);
		}
	}
}

function main_listner_create(){		//function 'check_header_title' 이벤트 등록용 함수 (마우스가 움직일때마다 호출)
	let body_listen = document.querySelector('#__layout');
	body_listen.addEventListener('mouseover', check_header_title);	//마우스가 움직일때 호출
}

/*스크립트가 실행중임을 보이는 코드*/
function domReady() {
	document.addEventListener("readystatechange", () => {
		if (document.readyState == 'complete') {		//요소가 모두 로딩된경우
			setTimeout(function () {	//1초간 대기 후 실행
				var footer_element = document.evaluate('//*[@id="footer"]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				if(footer_element != null){
					let styleSheet = document.createElement("style");
					styleSheet.innerText='[data-tooltip]{position:relative;}[data-tooltip]:before, [data-tooltip]:after{visibility:hidden;opacity:0;position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;transition:all .2s ease;font-size:15px;font-family:맑은고딕;letter-spacing:-1px;}[data-tooltip]:before{content:attr(data-tooltip);height:13px;position:absolute;top:-20px;padding:0px 10px 15px 10px;border-radius:5px;color:#fff;background:#025272;box-shadow:0 3px 8px rgba(165, 165, 165, 0.5);}[data-tooltip]:after{content: "";border-left:5px solid transparent;top:2px;border-right:5px solid transparent;border-top:5px solid #025272;}[data-tooltip]:not([data-tooltip=""]):hover:before{visibility:visible;opacity:1;top:-30px}[data-tooltip]:not([data-tooltip=""]):hover:after{visibility:visible;opacity:1;top:-8px}';
					document.head.appendChild(styleSheet);
					footer_element.innerHTML = '<b style="color:#ff0000;">[CUSTOM MODE ENABLED]</b> &nbsp'+footer_element.innerText;
					footer_element.setAttribute('data-tooltip',"VER: "+version);
				}
			},1000);
		}
	});
}
/*END*/

//백그라운드에서 버전체크 및 업데이트 알림
async function background_run(){
	while(true){
		await update_check();
		await sleep(10);	//10초마다 실행
	}
}

/*서버에서 업데이트를 체크하는 함수*/
async function update_check(){
	let update_check_url = 'https://raw.githubusercontent.com/bsy0317/Hanjin-Utility/main/util.js';
	let update_check_version = await fetch(update_check_url).then(response => response.text()).then(text => text.match(/var version = "(.*?)";/)[1]);
	if(version != update_check_version && version_check_ignore != true){ //버전이 다른경우&&업데이트 무시가 아닌경우
		this.$nuxt.$alert("'한진 유틸리티' 프로그램의 업데이트가 존재합니다.",'Update Notice');
		this.$nuxt.$alert("브라우저를 재시작하면 변경사항이 적용됩니다.",'Update Notice');
		version_check_ignore = true;	//업데이트 무시
	}
}
/*END*/

/*메인함수*/
function main(){	
	getExportCount();			//쿠키값을 점검하여 등록하는 함수 -> 출고번호를 관리하는 변수가 먼저 불러와져야 함
	domReady();					//Footer에 [CUSTOM MODE ENABLED] 추가하는 함수
	main_listner_create();		//'check_header_title' 함수 호출 -> 전체적인 EventListner를 호출하며 관리함
}

main(); //코드 실행

await background_run();	//백그라운드에서 버전체크 및 업데이트 알림