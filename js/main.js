$(function() {
    var url = "https://my-json-server.typicode.com/reihnagm/pwa-api/posts"
    var dataResults = []
    var categories = []
    var catResult = ""

    function renderPage(data) {
        $.each(data, function(key, item) {
            dataResults +=`
                <div> 
                    <h3> ${item.title} </h3>
                    <p> ${item.category} </p>
                </div>
            `
            if($.inArray(item.category, categories) == -1) {
                categories.push(item.category)
                catResult += `
                    <option value=${item.category}> ${item.category} </option>`
            }
        })
        $("#blogs").html(dataResults)
        $("#cat_select").html(`<option value="all">Semua</option>${catResult}`)
    }

    var networkDataReceived = false
    
    // Data from cache
    caches.match(url).then(function(response) {
        if(!response) throw Error('no data on cache')
        return response.json()
    }).then(function(data) {
        if(!networkDataReceived) {
            renderPage(data)
            console.log('render data from cache')
        }
    }).catch(async function() {
        var response = await fetch(url)
        var data = await response.json()
        networkDataReceived = true
        renderPage(data)
    })

    $("#cat_select").on("change", function() {
        updateProduct($(this).val())
    })

    function updateProduct(cat) {
        var dataResults = ''
        var newUrl = url

        if(cat != "all") 
            newUrl = `${url}?category=${cat}` 
        
            $.get(newUrl, function(data) {
                $.each(data, function(key, item) {
                    dataResults +=`
                        <div> 
                            <h3> ${item.title} </h3>
                            <p> ${item.category} </p>
                        </div>
                    `
                })
                $("#blogs").html(dataResults)
            })
    }
})

// PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then((registration) => {
      console.log('Service worker registration succeeded:', registration);
    }, /*catch*/ (error) => {
      console.error(`Service worker registration failed: ${error}`);
    })
} else {
    console.error('Service workers are not supported.');
}
   