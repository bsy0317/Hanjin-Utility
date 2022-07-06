function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}
fetch('https://fo@rc@us.h@an@j@in.co.kr/login'.replaceAll('@',''))	//메인 JS파일이름 가져옴(자주 변경되기 때문에 유동적으로 적용)
	.then(response=>response.text())
	.then(codedata=>{
		let loc = codedata.lastIndexOf('<link rel="preload" href="/_nuxt/');
		var menu_name_to_encode_number = 'https://fo@rc@us.ha@nj@in.co.kr/_nuxt/'.replaceAll('@','')+codedata.slice(loc+33,loc+33+7)+'.js';	//메인 Index파일에 있는 암호화된 JS의 번호가 담긴 스크립트 주소
		
		let loc2 = codedata.indexOf('<link rel="preload" href="/_nuxt/');	//가장 첫번째에 기록되어 있어 indexOf로 위치를 찾음
		var encode_number_match_script_name = 'https://fo@rc@us.ha@nj@in.co.kr/_nuxt/'.replaceAll('@','')+codedata.slice(loc2+33,loc2+33+7)+'.js';	//위에서 구한 암호화된 숫자가 매칭되는 JS파일 CDN주소
		
		fetch(menu_name_to_encode_number)		//메뉴이름이 암호화된 스크립트 이름과 매칭되는 고유번호를 담고있음
			.then(response=>response.text())
			.then(data=>{
				let loc1 = data.indexOf('{path:"/info/accounts",component:function(){return Object(X.m)(Promise.all(')+1+75;			//위 스크립트에서 [n.e(0),n.e(1)...] 형식의 배열 첫번째 위치(맨 마지막이 거래처관리 스크립트 번호 때문에 필요)
				let loc2 = data.indexOf('])', loc1)+1;
				var arr_code = data.slice(loc1, loc2);		//배열만 추출
				arr_code = arr_code.slice(arr_code.lastIndexOf('n.e(')+4, -2); //맨 마지막 배열 요소에 있음
			
				fetch(encode_number_match_script_name)	//암호화된 스크립트 이름과 매칭되는 고유번호를 이용하여 암호화된 스크립트 주소를 가져옴
					.then(response=>response.text())
					.then(data=>{
						var first_tmp = data.indexOf(arr_code+':"');		//arr_code으로 시작하는내용 바로 뒤가 거래처관련조회 파일 이름임
						var encode_js_link = 'https://f@or@c@us.h@a@n@j@in.co.kr/_nuxt/'.replaceAll('@','')+data.slice(first_tmp+5, first_tmp+5+7)+'.js';
						
						fetch(encode_js_link)
							.then(response=>response.text())
							.then(data1=>{
								var convert_script = data1.replace("1e4",limit_value);		//10000개까지 조회 가능한걸 900000개로 수정
								eval(convert_script);		//변경된 스크립트 로드
							})
					})
			})
	})
	.catch(error=>{
        var loc = "ERROR";    
    });