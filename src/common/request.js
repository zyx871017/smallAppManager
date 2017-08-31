fetch("https://www.qaformath.com/zbuniserver-api/category/get-categories-list", {
    headers: {
        'Cache-Control': 'no-cache'
    }
})
    .then(function(response){
        console.log(response);
    });