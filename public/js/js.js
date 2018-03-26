
//code slider--------------------------
$(document).ready(function(){
 
$('#itemslider').carousel({ interval: 3000 });
 
$('.carousel-showmanymoveone .item').each(function(){
var itemToClone = $(this);
 
for (var i=1;i<4;i++) {
itemToClone = itemToClone.next();
 
if (!itemToClone.length) {
itemToClone = $(this).siblings(':first');
}
 
itemToClone.children(':first-child').clone()
.addClass("cloneditem-"+(i))
.appendTo($(this));
}
});
});

//Cố định avatar trang info
$(document).ready(function () {  
    $(window).scroll(function(){
    var top = $(this).scrollTop();
      if (top> 65) {
        $(".menu").addClass("fix-box");
      } else {
        $(".menu").removeClass("fix-box");
      }
    });
});



