const analizeData = document.querySelector('.data');
const fileChooser = document.querySelector('#file');
const fileName = document.querySelector('#text');
const analizeBtn = document.querySelector('.analize');
const container = document.querySelector('.container');
const allText = document.querySelector('#alltext');
const TIMEOUT_VALUE = 100000;
const parser = new DOMParser();

const renderResult = (normalize, symbols, links, errorLinks) => `<h2>Результат:</h2>
<p>Сивмолы нормализованного текст: ${normalize}</p>
<p>Сивмолы без пробелом: ${symbols}</p>
<p>Количество внутренних ссылков: ${links}</p>
<p>Количество битых ссылок: ${errorLinks}</p>`;

const download = function(url) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'text';
  xhr.addEventListener('load', function () {
    if (xhr.status === LoadStatus.OK) {
      parseText(xhr.response);
    } else {
      window.alert('Невозможно прочитать файл. Проверьте адрес и перезагрузите страницу');
    }
  });
  xhr.addEventListener('error', function () {
    window.alert('Невозможно прочитать файл. Проверьте адрес и перезагрузите страницу');
  });
  xhr.addEventListener('timeout', function () {
    window.alert('Невозможно прочитать файл. Проверьте адрес и перезагрузите страницу');
  });

  xhr.timeout = TIMEOUT_VALUE;

  xhr.open('GET', url);
  xhr.send();
};

const onAnalizeBtnClick = function(evt) {
  evt.preventDefault;
  if(fileName.value) {
    download(fileName.value);
    fileName.disabled = true;
    fileChooser.disabled = true;
    analizeBtn.disabled = true;
  }
  analizeBtn.removeEventListener('click', onAnalizeBtnClick);
};

analizeBtn.addEventListener('click', onAnalizeBtnClick);

const parseText = function(data) {
  let crashLinks = 0;
  let internalLinks = 0;
  let xmlStr = data;
  xmlDoc = parser.parseFromString(xmlStr, `text/xml`);
  const links = Array.from(xmlDoc.getElementsByTagName('a'));
  links.forEach(function(link) {
    if(!xmlDoc.querySelector(link.getAttribute('l:href'))) {
      crashLinks++;
    }
    if(link.attributes[0].value.charAt(0) === '#') {
      internalLinks++;
    }
  });
  let elements = Array.from(xmlDoc.getElementsByTagName('*'));
  let text = elements.map((element) => element.tagName.toLowerCase() !== 'binary' ? element.textContent : '').join('')
  let fullText = text.length;
  var onlySymbols = text.replace(new RegExp("\\s", "g"), "").length;
  const renderText = renderResult(fullText, onlySymbols, internalLinks, crashLinks);
  container.insertAdjacentHTML('afterbegin', renderText);
};

fileChooser.addEventListener('change', function () {
  if(fileChooser.files) {
    fileName.disabled = true;
    fileChooser.disabled = true;
  }
  var file = fileChooser.files[0];
  var reader = new FileReader();
  reader.addEventListener('load', function () {
    parseText(reader.result);
  });
  reader.readAsText(file);
});
