
const BASE_URL = 'https://api.harvardartmuseums.org';
const KEY = 'apikey=cef9253a-aabb-442d-aaf5-6013e9448b59'; // USE YOUR KEY HERE

 function fetchObjects() {
  const url = `${ BASE_URL }/object?${ 'apikey=cef9253a-aabb-442d-aaf5-6013e9448b59' }`

    
   fetch(url)
        .then(function (response) {
            return response.json()
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
}



async function fetchObjects() {
    const url = `${ BASE_URL }/object?${ KEY }`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchObjects() {
    const url = `${ BASE_URL }/object?${ KEY }`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  
  
  // fetchObjects().then(x => console.log(x)); // { info: {}, records: [{}, {},]}
  
  
  async function fetchAllCenturies() {
    const url = `${ BASE_URL }/century?${ KEY }&size=100&sort=temporalorder`;
    const storage = JSON.parse(localStorage.getItem('centuries'));
  if (storage) {
    return storage;
  }    
    try {
      const response = await fetch(url);
      const data = await response.json();
      const records = data.records;
      
      localStorage.setItem('centuries', JSON.stringify(records));
  
      return records;
      
    } catch (error) {
      throw new Error();
    }
  };
  
  
  async function fetchAllClassifications () {
    
  const url = `${ BASE_URL }/classification?${ KEY }&size=100&sort=name`;
  const storedStuff = JSON.parse(localStorage.getItem('classifications'));
    
  if (storedStuff) {
    return storedStuff;
  }
    
      try {
      const response = await fetch(url);
      const data = await response.json();
      const records = data.records;
      //console.log(records);
      
      localStorage.setItem('classifications', JSON.stringify(records));
  
      return records;
      
    } catch (error) {
      console.error(error);
    }
    
    
    
    
  }
  
  
  async function prefetchCategoryLists() {
    try {
      const [
        classifications, centuries
      ] = await Promise.all([
        fetchAllClassifications(),
        fetchAllCenturies()
      ]);
  $('.classification-count').text(`(${ classifications.length })`);
  
  classifications.forEach(classification => {
  $('#select-classification').append($(`<option value="${classification.name}">${classification.name}</option>`))
  })
  
  $('.century-count').text(`(${ centuries.length }))`);
  centuries.forEach(century => {
  $('#select-century').append($(`<option value="${century.name}">${century.name}</option>`))
  });
    }catch (error) {
      console.error(error);
    }
  };
  
  function buildSearchString() { 
  var classified = $('#select-classification').val() ? `&classification=${$('#select-classification').val()}`: '';
  var times = $('#select-century').val() ? `&century=${$('#select-century').val()}`: '';
  var keys = $('#keywords').val() ? `&keyword=${$('#keywords').val()}`: '';
  
  const url = `${ BASE_URL }/object?${ KEY }${ classified }${ times }${ keys }`;
  const encodedUrl = encodeURI(url); 
   
    
    return encodedUrl;
  };
  
  
    
  $('#search').on('submit', async function (event) {
    event.preventDefault();
     onFetchStart();
      
      
    try {
   const siteSearch = await fetch(buildSearchString());  
   const {info, records } = await siteSearch.json();
      
   // console.log("Records:", records)  
   //  console.log("Info:", info);
      
   updatePreview(records,info); 
      
    } catch (error) {
      console.log(error)
    } finally {
      onFetchEnd();
    }
  });
      
  
  
   
  function onFetchStart() {
    $('#loading').addClass('active');
  }
  
  function onFetchEnd() {
    $('#loading').removeClass('active');
  }
  
  
  function renderPreview(record) {
      const {title, dated, description, culture, style, technique, medium, dimensions, people, department, division, contact, creditline, images, primaryimageurl} = record
  
   const recordView = $(`<div class="object-preview">
      <a href="#">
        <img src="${primaryimageurl ? primaryimageurl : ''}" />
        <h3>"${title ? title : ''}" </h3>
        <h3>"${description ? description : ''}" </h3>
      </a>
    </div>`).data('record', record);
    
    return recordView;
  
  }
  
  
  function updatePreview(records, info) {
    const root = $('#preview'); 
       if(info.prev){ 
          
      root.find('.previous').data('url', info.prev).attr('disabled', false);    
          
          }else{
            root.find('.previous').data('url', null).attr('disabled', true);
          }
      
      if(info.next){ 
          
      root.find('.next').data('url', info.next).attr('disabled', false);    
          
          }else{
            root.find('.next').data('url', null).attr('disabled', true);
          }
    
       var resultsE = root.find('.results');
    console.log(resultsE, 'results');
      resultsE.empty();
  
    records.forEach(function(record){
      resultsE.append(renderPreview(record));
      
     
      
     })
  return resultsE;
  }
  
  $('#preview .next, #preview .previous').on('click', async function () {
    try {
      const url = $(this).data('url');
      const response = await fetch(url);
      const data = await response.json();
      const {records, info} = await data;
      
      updatePreview(records, info);
    } catch(error){
      console.log(error);
  }finally {
    onFetchEnd();
  }
  });
  
  
  $('#preview').on('click', '.object-preview', function (event) {
    event.preventDefault(); 
    $('#feature').empty();
    let currentItem = $(this).data('record');
    console.log(currentItem);
    $('#feature').append(renderFeature(currentItem));  
  });
  
  
  function renderFeature(record){
    const feature = $(`<div class="object-feature">
    <header>
      <h3>${record.title}</h3>
      <h4>${record.dated}</h4>
    </header>
    <section class="facts">
     ${record.description ? `<span class="title">Description</span><span class="content">${record.description}</span>` : ''}
     ${record.culture ? `<span class="title">Culture</span><span class="content"><a href=''>${record.culture}</a></span>` : ''}
     ${record.style ? `<span class="title">Style</span><span class="content">${record.style}</span>` : ''}
     ${record.technique ? `<span class="title">Technique</span><span class="content"><a href=''>${record.technique}</a></span>` : ''}
     ${record.medium ? `<span class="title">Medium</span><span class="content"><a href=''>${record.medium}</a></span>` : ''}
     ${record.dimensions ? `<span class="title">Dimensions</span><span class="content">${record.dimensions}</span>` : ''} 
     
     ${ record.people ? record.people.map(function(person) { 
     return `<span class="title">Person</span><span class="content"><a href=''>${record.people}</a></span>`
     }).join('') : ''
                      }
                      
     
     ${record.department? `<span class="title">Department</span><span class="content">${record.department}</span>` : ''}
     ${record.division? `<span class="title">Division</span><span class="content">${record.division}</span>` : ''}  
     ${record.contact? `<span class="title">Contact</span><span class="content"><a href='mailto:${record.contact}'>${record.contact}</a></span>` : ''}   
     ${record.creditline? `<span class="title">Credit</span><span class="content">${record.creditline}</span>` : ''}
       
    </section>
    <section class="photos">
      <img src='${record.images, record.primaryimageurl}' />
     
    </section>
  </div>`)
    
   return feature; 
    
  }
  
  function searchURL(searchType, searchString) {
    return `${ BASE_URL }/object?${ KEY }&${ searchType}=${ searchString }`;
    
  }
  
  
  $('#feature').on('click', 'a', async function (event) {
   let link = $(this).attr('href')
   event.preventDefault(); 
    onFetchStart();
    try {
   const siteSearch = await fetch(href);  
   const {records, info} = await siteSearch.json();
   updatePreview(records, info); 
  } catch (error){
    console.log(error)
  } finally {
      onFetchEnd();
  }
    
    
  
  });
   
  
  fetchObjects();
  prefetchCategoryLists();
   
  
  
  
  