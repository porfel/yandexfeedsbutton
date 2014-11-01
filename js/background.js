var unautorized = 0;
var count = 0;

chrome.browserAction.onClicked.addListener(function () {
    if (count == 0 ) {
        chrome.tabs.create({url: "https://mail.yandex.ru/my/#lenta/group/all",selected: true}, function() {});
    } else {
        chrome.tabs.create({url: "https://mail.yandex.ru/my/#lenta/group/all/unread",selected: true}, function() {});
        count = 0;
        displayFeed();
    } 
});


function displayFeed(){
    var badgeText;
    var icon;
    if ( unautorized == 1 ) {
        icon = 'lenta-unautorized.png';
        badgeText = 'Необходимо авторизоваться в Яндексе';
    } else {
	    icon = count > 0 ? 'lenta-unread.png' : 'lenta.png';
        badgeText = count > 0 ? 'Непрочитанных: ' + count : "Непрочитанных подписок нет";
    }
    var icon_text = count > 0 ? "" + count : "";
    
    chrome.browserAction.setTitle({title: badgeText });
	chrome.browserAction.setBadgeText({text: icon_text });
	chrome.browserAction.setIcon({ path: icon });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#ff536a' });
}

function checkFeed(){
	var checkInterval = 60000;
    var pageContent;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'http://m.lenta.yandex.ru/unread.xml', false);
    try {
    	xmlhttp.send(null);
    } catch (e){
    	unautorized = 1;
    	setTimeout('checkFeed()', checkInterval);
        displayFeed();
    	return;
    }
    if(xmlhttp.status == 200) {
        pageContent = xmlhttp.responseText;
    }
    var startTag = '<a href="./read.xml?group=all">Все подписки</a>';
    var endTag = '</h2>'
    var startPos = pageContent.indexOf(startTag);
    if (startPos == -1 || startPos == undefined ) {
        unautorized = 1;
        setTimeout('checkFeed()', checkInterval);
        displayFeed();
        return;
    } else {
        unautorized = 0;
        startPos = startPos + 47;
    }
    var rawCounter = pageContent.substring(startPos,pageContent.indexOf(endTag));
    count = rawCounter.replace(" ","").replace("(","").replace(")","");
    displayFeed();
    setTimeout('checkFeed()', checkInterval);
    return;
}

function openTab(){
    chrome.tabs.create({url: "https://mail.yandex.ru/my/#lenta/group/all",selected: true}, function() {});  
}

checkFeed();




