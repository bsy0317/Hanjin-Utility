var autoFill = true;
var __export_count = 1;		//출고번호 기본값
var content_header_title = getElementByXpath('//*[@id="__layout"]/div/main/div/section/header/h1');
var console = window.console || {log:function(){}};
var customerDataArray = new Array();

function customerData(name, call, phone, postcode, address1, address2, sender){
	this.name = name;
	this.call = call;
	this.phone = phone;
	this.postcode = postcode;
	this.address1 = address1;
	this.address2 = address2;
	this.sender = sender;
}

function setCookie(cookie_name, value, days) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + days);
	exdate.setHours(0,0,0);					//자정에 데이터만료
	var cookie_value = escape(value) + ((days == null) ? '' : '; expires=' + exdate.toUTCString());
	document.cookie = cookie_name + '=' + cookie_value;
}
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
function getElementByXpath(path) { 
	return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function click_juso(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		console.log("juso.go.kr 모달 열림");
		let juso_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[13]/div/div/div[2]/div/div/div[2]/div/div/fieldset/input'); // input 태그 취득
		if(juso_input != null){
			juso_input.focus();
		}
	}
}
function click_submit(){
	console.log("단건입력 모달 열림");
	if(content_header_title.innerText.indexOf('출력자료등록') != -1){
		let today = new Date();
		let year = today.getFullYear();
		let month = ('0' + (today.getMonth() + 1)).slice(-2);
		let day = ('0' + today.getDate()).slice(-2);
		__export_value = year+month+day+"-"+__export_count;		//20220624-01 과 같은 형식으로 출고번호를 만듭니다.
		__export_count = __export_count + 1;					//출고번호 +1
		setCookie("export_count", String(__export_count), 1); 	//현재까지의 출고번호를 쿠키에 저장합니다.
		
		let item_name_input = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[1]/dl[1]/dd/div/input'); // input 태그 취득
		item_name_input.value="반건조생선,건어물 냉동보관필수 당일배송 부탁드립니다."; // input 태그 취득
		item_name_input.dispatchEvent(new Event('input'));
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[1]/input').value="반건조생선"; 				//내품명
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[3]/input').value="1";      				//내품수량
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input').value= __export_value;			//출고번호
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[2]/dd/div/input').value= "냉동보관이 필요한 상품입니다.";			//특이사항
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[3]/dl[1]/dd/div/div/input').focus();
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[1]/input').dispatchEvent(new Event('input'));
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[3]/input').dispatchEvent(new Event('input'));
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[3]/dl[1]/dd/div/div/input').dispatchEvent(new Event('input'));
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input').dispatchEvent(new Event('input'));
		getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[2]/dd/div/input').dispatchEvent(new Event('input'));
		
		let stack_pop_btn = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[3]/div/div[1]/button[2]'); //스택에서 불러오기 버튼 Element
		if(stack_pop_btn != null) stack_pop_btn.remove(); stack_pop_btn=null;//만약 존재한다면 지움(그래야 현재 남은 사람이 보임)
		if(stack_pop_btn == null){						 //버튼이 지
		let btn = document.createElement('button');
			btn.classList.add('el-button','button-default','el-button--default','el-button--medium');	//스택에서 불러오기 버튼에 class 추가
			btn.textContent = customerDataArray.length <=0 ? '비어있음':'스택에서 꺼내기('+customerDataArray.length+'개 남음/'+customerDataArray[0]['name']+')';
			getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[3]/div/div[1]').appendChild(btn)
			btn.addEventListener('click',function(event){
				//출력자료 등록시 일전에 등록한 거래처 명단 순차 자동입력
				if(autoFill && customerDataArray.length > 0){ //기능이 활성화된경우
					let temp_data = customerDataArray.pop();
					btn.textContent = customerDataArray.length <=0 ? '비어있음':'스택에서 꺼내기('+customerDataArray.length+'개 남음/'+customerDataArray[customerDataArray.length-1]['name']+')'; //스택 버튼에 반영
					
					let postcode = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[1]/dl/dd/div/div[1]/div[1]/input');
					postcode.value=temp_data.postcode;
					
					let juso1 = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[1]/dl/dd/div/div[2]/div[1]/input');
					juso1.value=temp_data.address1;
					
					let juso2 = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[1]/dl/dd/div/div[2]/div[2]/input');
					juso2.value=temp_data.address2;
					
					let name = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[2]/dl[1]/dd/div/div/input')
					name.value=temp_data.name;
					
					let call = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[3]/dl[1]/dd/div/div/input');
					call.value=temp_data.call;
					
					let phone = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[3]/dl[2]/dd/div/input');
					phone.value=temp_data.phone;
					if(temp_data.sender != "" && temp_data.sender != null){
						let split_data = temp_data.sender.split(','); // 메모1칸의 ',' 기준으로 자름(보내는이 이름,전화번호)
						let sender_name = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[2]/dl[1]/dd/div/div/input');
						sender_name.value=split_data[0];
						let sender_phone = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input');
						sender_phone.value=split_data[1];
						sender_name.dispatchEvent(new Event('input'));
						sender_phone.dispatchEvent(new Event('input'));
					}else{
						let sender_name = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[2]/dl[1]/dd/div/div/input');
						sender_name.value="속초웰빙반건조";
						let sender_phone = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input');
						sender_phone.value="01053821766";
						sender_name.dispatchEvent(new Event('input'));
						sender_phone.dispatchEvent(new Event('input'));
					}
					postcode.dispatchEvent(new Event('input'));
					juso1.dispatchEvent(new Event('input'));
					juso2.dispatchEvent(new Event('input'));
					name.dispatchEvent(new Event('input'));
					call.dispatchEvent(new Event('input'));
					phone.dispatchEvent(new Event('input'));
				}
				let item_name_input = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[1]/dl[1]/dd/div/input'); // input 태그 취득
				item_name_input.value="반건조생선,건어물 냉동보관필수 당일배송 부탁드립니다."; // input 태그 취득
				item_name_input.dispatchEvent(new Event('input'));
				getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[1]/input').value="반건조생선"; 				//내품명
				getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[3]/input').value="1";      				//내품수량
				getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input').value= __export_value;			//출고번호
				getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[2]/dd/div/input').value= "냉동보관이 필요한 상품입니다.";			//특이사항
				getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[3]/dl[1]/dd/div/div/input').focus();
				getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[1]/input').dispatchEvent(new Event('input'));
				getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[2]/dl/dd/div/div[3]/input').dispatchEvent(new Event('input'));
				getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div[3]/dl[1]/dd/div/div/input').dispatchEvent(new Event('input'));
				getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input').dispatchEvent(new Event('input'));
				getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[4]/div[2]/div/div/div[3]/dl[2]/dd/div/input').dispatchEvent(new Event('input'));
			});
		}
		
		let reset_sender_btn = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[3]/div/div[1]/button[3]');
		if(reset_sender_btn == null){
			let btn2 = document.createElement('button');
			btn2.classList.add('el-button','button-default','el-button--default','el-button--medium');
			btn2.textContent = '발송인 초기화';
			getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[3]/div/div[1]').appendChild(btn2)
			btn2.addEventListener('click',function(event){
				let sender_name = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[2]/dl[1]/dd/div/div/input');
				sender_name.value="속초웰빙반건조";
				let sender_phone = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[6]/div/div[2]/div[1]/div/div[1]/div[2]/div/div/div[3]/dl[1]/dd/div/div/input');
				sender_phone.value="01053821766";
				sender_name.dispatchEvent(new Event('input'));
				sender_phone.dispatchEvent(new Event('input'));
			});
		}
		
	}
}
function number_autocopy(){
	let local_num_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[9]/div/div/input');
	let phone_num_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[11]/div/div/input');
	phone_num_input.value = local_num_input.value;
	phone_num_input.dispatchEvent(new Event('input'));
	
}
function new_row_autofocus(){
	let toprow_namw_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[7]/div/div/input');
	toprow_namw_input.focus();
}
function check_header_title(){
	content_header_title = getElementByXpath('/html/body/div[1]/div/div/main/div/section/header/h1');
	if(content_header_title != null){
		console.log("타이틀 >> " + content_header_title);
		phone_num_autocopy()
		//client_juso_autofocus()
		data_regist_autoinput()
		management_number_listen()
		phone_num_tab_listen()
		new_rowbtn_listen()
		submit_juso_enter()
	}else{
		content_header_title = getElementByXpath('/html');
	}
}

//Listner 선언부분
function management_number_listen(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		var management_number_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[6]/div/div/input');
		if(management_number_input != null){
			let today = new Date();
			let year = today.getFullYear();
			let month = ('0' + (today.getMonth() + 1)).slice(-2);
			let day = ('0' + today.getDate()).slice(-2);
			let hours = ('0' + today.getHours()).slice(-2);
			management_number_input.value = year+month+day+hours;
			management_number_input.dispatchEvent(new Event('input'));
		}
	}
}
function data_regist_autoinput(){
	if(content_header_title.innerText.indexOf('출력자료등록') != -1){
		const $submit_input_listen = getElementByXpath('/html/body/div/div/div/main/div/section/div[1]/div[1]/button');
		$submit_input_listen.addEventListener('click', click_submit);
		reset_btn_listen = getElementByXpath('/html/body/div[2]/div/div[3]/button');
		reset_btn_listen2 = getElementByXpath('/html/body/div[2]/div/div[3]/button[2]');
		if(reset_btn_listen != null) reset_btn_listen.addEventListener('click', click_submit);
		if(reset_btn_listen2 != null) reset_btn_listen2.addEventListener('click', click_submit);
	}
}
function phone_num_autocopy(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		let local_num_input = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[9]/div/div/input');
		if(local_num_input != null){
			local_num_input.addEventListener('input', number_autocopy);
		}
	}
}
function phone_num_tab_listen(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		let phone_num_input = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr[1]/td[12]/div/div/input');
		if(phone_num_input != null){
			phone_num_input.addEventListener('keydown',function(event){
				if(event.keyCode == 9){
					event.preventDefault();
					let juso_input_listen = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[2]/div[1]/div[3]/table/tbody/tr/td[13]/div/div/div[2]/button');
					juso_input_listen.click();
					click_juso();
				}
			});
		}
	}
}
function new_rowbtn_listen(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		let new_rowbtn = getElementByXpath('//*[@id="__layout"]/div/main/div/section/div[2]/div[1]/div[2]/button[1]');
		if(new_rowbtn != null){
			new_rowbtn.addEventListener('click', new_row_autofocus);
		}
	}
}
/*거래처 관리->주소입력->데이터로 따로 저장*/
function submit_juso_enter(){
	if(content_header_title.innerText.indexOf('거래처 관리') != -1){
		let address_input = getElementByXpath('/html/body/div[1]/div/div/main/div/section/div[3]/div/button[2]');
		if(address_input != null){
			address_input.addEventListener('click',function(event){
				let table_body=document.querySelector('#__layout > div > main > div > section > div:nth-child(3) > div.content-result-table.grid-fixed > div.el-table.el-table--fit.el-table--fluid-height.el-table--scrollable-x.el-table--enable-row-hover.el-table--enable-row-transition.el-table--medium > div.el-table__body-wrapper.is-scrolling-left > table > tbody').children;
				customerDataArray.length=0;			//이전에 저장된 정보 리셋
				for(var i=0; i<table_body.length; i++){
					let table_row=table_body[i].getElementsByClassName('el-input__inner');
					let temp_array=new Array();
					for(var j=0; j<table_row.length; j++){
						let table_col=table_row[j].value;
						temp_array.push(table_col);
					}
					customerDataArray.push(new customerData(temp_array[1], temp_array[3], temp_array[5], temp_array[7], temp_array[8], temp_array[9], temp_array[11]));
				}
				//customerDataArray.push(new customerData(name, call, phone, postcode, juso1, juso2, sender));
			});
		}
	}
}

function main_listner_create(){
	const $body_listen = getElementByXpath('/html/body');
	$body_listen.addEventListener('mouseover', check_header_title);
}

/*메인실행부분*/
getExportCount();
main_listner_create();
/*메인실행부분*/

if (document.addEventListener) {
	document.addEventListener("onreadystatechange", function () {
        if (document.readyState === "complete") {
            document.removeEventListener("onreadystatechange", arguments.callee, false);
            domReady();
        }
	}, false);
}
function domReady () {
	var footer_element = document.evaluate('//*[@id="footer"]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(footer_element != null){
      var footer_text = footer_element.innerText;
    }
	if(footer_element === null || footer_text.indexOf('CUSTOM MODE ENABLED') < 0){
		location.reload(true);
	}
}