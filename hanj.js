var inject_footer = function(){
	var footer_element = document.evaluate('//*[@id="footer"]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	footer_element.innerHTML = '<b style="color:#ff0000;">[CUSTOM MODE ENABLED]</b> &nbsp'+footer_element.innerText;
};
fetch('https://fo@rc@us.h@an@j@in.co.kr/login'.replaceAll('@',''))	//메인 JS파일이름 가져옴(자주 변경되기 때문에 유동적으로 적용)
	.then(response=>response.text())
	.then(codedata=>{
		var loc = codedata.indexOf('<link rel="preload" href="/_nuxt/');	//가장 첫번째에 기록되어 있어 indexOf로 위치를 찾음
		var encode_main_script = 'https://fo@rc@us.ha@nj@in.co.kr/_nuxt/'.replaceAll('@','')+codedata.slice(loc+33,loc+33+7)+'.js';	//위에서 구한 메인JS파일 CDN주소
		
		fetch(encode_main_script)
			.then(response=>response.text())
			.then(data=>{
				var first_tmp = data.indexOf('190:"');		//190:으로 시작하는내용 바로 뒤가 거래처관련조회 파일 이름임
				var encode_js_link = 'https://f@or@c@us.h@a@n@j@in.co.kr/_nuxt/'.replaceAll('@','')+data.slice(first_tmp+5, first_tmp+5+7)+'.js';
				
				fetch(encode_js_link)
					.then(response=>response.text())
					.then(data1=>{
						var convert_script = data1.replace("1e4",limit_value);		//10000개까지 조회 가능한걸 900000개로 수정
						eval(convert_script);		//변경된 스크립트 로드
						if (document.readyState === "complete") inject_footer();
						else (addEventListener || attachEvent).call(window, addEventListener ? "load" : "onload", inject_footer);
					})
			})
	})