
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $street = $('#street');
    var $city = $('#city');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $nytElem.empty();
    $wikiElem.empty();

    // load streetview
    var url = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + $street.val() + ', ' + $city.val();
    var $image = $('<img class="bgimg" src =' + '"' + url + '"' + '>');
    $body.append($image);

    // NYTimes
    url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "0a0ef3c641424fbe806a9fc2fd5ea166",
      'q': $city.val()
    });
    $.getJSON(url, function(result){
      console.log(result);
      console.log(result.response.docs[0].headline.main);

      for (var i = 0; i < result.response.docs.length; i++){
        var $article = $('<li class="article"></li>');
        $nytElem.append($article);
        var $articleHeader = $('<a href="' + result.response.docs[i].web_url + '">' + result.response.docs[i].headline.main + '</a>');
        var $articlePara = $('<p>' + result.response.docs[i].snippet + '</p>');
        $('.article').last().append($articleHeader);
        $('.article').last().append($articlePara);
      }
    })
    .error(function(){
      $nytElem.append('<h2>New York Times Articles Could Not Be Loaded</h2>');
    });

    //wikipedia-links
    url = "https://en.wikipedia.org/w/api.php?action=opensearch&";
    url += $.param({
      'search': $city.val()
    });
    url += "&format=json&callback=wikiCallback";
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(result){
        console.log(result);
        var articleList = result[1];
        var urlList = result[3];
        for (var i = 0; i < articleList.length; i++){
          article = articleList[i];
          url = urlList[i];
          $wikiElem.append('<li><a href="' + url + '">' + article + '</a></li>');
        };
      }
    });

    return false;
};

$('#form-container').submit(loadData);
