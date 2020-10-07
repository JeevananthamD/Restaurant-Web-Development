// More button retreat
$(function() { // same as document.addEventListener("DOMContentLoaded", function() {
  $("#navbarToggle").blur (function() { // same as document.querySelector("#navbarToggle").addEventListener("blur", (function() {
    var screenwidth = window.innerWidth;
    if(screenwidth < 768) {
      $("#collapsable-nav").collapse("hide");
    }
  });
});
// End of more button retreat

// Dynamic page loading
(function(global) {
  var dc = {};
  var homeHtml="snippets/home.html";
  var menuCategoryTitleHtml="snippets/menu-category-title.html";
  var menuCategoriesHtml="snippets/menu-categories.html";
  var singleCategoryTitleHtml="snippets/single-category-title.html";
  var singleCategoryHtml="snippets/single-category.html";
  var allCategoriesUrl="https://davids-restaurant.herokuapp.com/categories.json";
  var singleCategoryUrl="http://davids-restaurant.herokuapp.com/menu_items.json?category=";

  // Convinience function for inserting innerHTML for selector
  function insertHtml(selector, html) {
    var targetEle = document.querySelector(selector);
    targetEle.innerHTML = html;
  }

  // Show loading icon inside element identified by selector
  function showLoading(selector) {
    var html = "<div class = 'text-center'>";
    html += " <img src = 'images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  }

  // Insert property
  function insertProperty(string, propName, propValue) {
    var replacedPropText="{{"+propName+"}}";
    string=string.replace(new RegExp(replacedPropText, "g"), propValue);
    return string;
  }

  // Button active
  function menuButtonActive() {
    var classes=document.querySelector("#menuButton").className; 
    if(classes.indexOf("active")==-1) { // indexOf returns -1 if it can not find "active"
      classes+=" active";
      document.querySelector("#menuButton").className=classes; // $("#menuButton").className=classes; doesn't work because it's not function
    }
  }

  //Home page
  $(function() {
    showLoading("#main-content");
    $ajax.sendGetRequest(homeHtml, function(responseText) {
      insertHtml("#main-content", responseText);
    }, false );
  });

  //Menu page
  dc.loadMenuCategories=function() {
    showLoading("#main-content");
    var homeButton="<a href='Restaurant Project.html'><span class='glyphicon glyphicon-home'></span><br class='hidden-xs'>Home</a>"; // Home button appearance
    insertHtml("#homeButton", homeButton);
    menuButtonActive();
    $ajax.sendGetRequest(allCategoriesUrl, function(categoriesResponse) {
      $ajax.sendGetRequest(menuCategoryTitleHtml, function(menuCategoryTitle) {
        $ajax.sendGetRequest(menuCategoriesHtml, function(menuCategories) {
          var menuCategoriesPage=buildMenuCategories(menuCategoryTitle, menuCategories, categoriesResponse);
          insertHtml("#main-content", menuCategoriesPage);
        }, false);
      }, false);
    });
  };

  function buildMenuCategories(menuCategoryTitle, menuCategories, categoriesResponse) {
    var finalhtml=menuCategoryTitle;
    finalhtml+="<section class='row'>";
    for(var i=0; i<categoriesResponse.length; i++) {
      var html=menuCategories;
      var name=categoriesResponse[i].name;
      var shortName=categoriesResponse[i].short_name;
      html=insertProperty(html, "name", name);
      html=insertProperty(html, "short_name", shortName);
      finalhtml+=html;
    }
    finalhtml+="</section>";
    return finalhtml;
  }

  // Single menu page
  dc.loadSingleCategory=function(singleCategoryLetter) { 
    showLoading("#main-content");
    var finalSingleCategoryUrl=singleCategoryUrl+singleCategoryLetter;
    $ajax.sendGetRequest(finalSingleCategoryUrl, buildSingleCategoryTitle);
  };

  // Single menu title
  function buildSingleCategoryTitle(singleCategoryUrlResponse) {
    var categoryName=singleCategoryUrlResponse.category.name;
    var specialInstructions=singleCategoryUrlResponse.category.special_instructions;
    $ajax.sendGetRequest(singleCategoryTitleHtml, function(singleCategoryTitleResponse) {
      var titleHtml=singleCategoryTitleResponse;
      titleHtml=insertProperty(titleHtml, "category_name", categoryName);
      titleHtml=insertProperty(titleHtml, "special_instructions", specialInstructions);
      $ajax.sendGetRequest(singleCategoryHtml, function(singleCategoryResponse) {
        var singleCategoryPage=buildSingleCategory(singleCategoryUrlResponse, titleHtml, singleCategoryResponse);
        insertHtml("#main-content", singleCategoryPage);
      }, false);
    }, false);
  }

  // Single menu body
  function buildSingleCategory(singleCategoryUrlResponse, titleHtml, singleCategoryResponse) {
    finalCategoryHtml=titleHtml;
    finalCategoryHtml+="<section class='row'>";
    var categoryShortName=singleCategoryUrlResponse.category.short_name;
    var menuItems=singleCategoryUrlResponse.menu_items;
    for(var i=0; i<menuItems.length; i++) {
      var html=singleCategoryResponse;
      var itemShortName=menuItems[i].short_name;
      var priceSmall=menuItems[i].price_small;
      var priceCondition=priceSmall;
      var smallPortionName=menuItems[i].small_portion_name;
      smallPortionName="("+smallPortionName+")";
      var priceLarge=menuItems[i].price_large;
      var largePortionName=menuItems[i].large_portion_name;
      largePortionName="("+largePortionName+")";
      var name=menuItems[i].name;
      var description=menuItems[i].description;
      html=insertProperty(html, "item_short_name", itemShortName);
      html=insertProperty(html, "category_short_name", categoryShortName);
      html=insertProperty(html, "name", name);
      html=insertProperty(html, "description", description);
      if(priceCondition==null){
        priceLarge="$"+ priceLarge.toFixed(2); // to make 2 decimal eg. 5.00
        html=insertProperty(html, "price_large", priceLarge);
        html=insertProperty(html, "large_portion_name", "");
        html=insertProperty(html, "price_small", "");
        html=insertProperty(html, "small_portion_name", "");
      }
      else {
        priceLarge="$"+ priceLarge.toFixed(2);
        priceSmall="$"+ priceSmall.toFixed(2);
        html=insertProperty(html, "price_small", priceSmall);
        html=insertProperty(html, "small_portion_name", smallPortionName);
        html=insertProperty(html, "price_large", priceLarge);
        html=insertProperty(html, "large_portion_name", largePortionName);
      } 
      if(i%2!=0) {
        html+="<div class='clearfix visible-md-block visible-lg-block'></div>";
      }
      finalCategoryHtml+=html;
    } //End of for loop
    finalCategoryHtml+="</section>";
    return finalCategoryHtml;
  }

  global.$dc = dc;
})(window);
// End of dynamic page loading
