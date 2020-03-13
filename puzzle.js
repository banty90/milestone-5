let stepCount=0;
let startTime=new Date().getTime();
let gameover=0;
let images = [{src:'https://imagepuzzle.s3.us-east-2.amazonaws.com/london-bridge.jpg',title:'London Bridge'},
                { src: 'https://imagepuzzle.s3.us-east-2.amazonaws.com/lotus-temple.JPG', title: 'Lotus Temple' },
                { src: 'https://imagepuzzle.s3.us-east-2.amazonaws.com/qutub-minar.jpg', title: 'Qutub Minar' },
                { src: 'https://imagepuzzle.s3.us-east-2.amazonaws.com/statue-of-liberty.jpg', title: 'Statue Of Liberty' },
                { src: 'https://imagepuzzle.s3.us-east-2.amazonaws.com/taj-mahal.jpg', title: 'Taj Mahal' }
            ]; // Array of images with their source loation.
//console.log(images[0].src);

$(function(){
let gridSize=$(":radio[name='level']:checked").val();
startGame(images, gridSize); // starting game
                $('#newPhoto').click(function () {
                    gridSize = $(":radio[name='level']:checked").val();  // Take the updated gridSize from UI.
                   //console.log(gridsize); 
                   startGame(images, gridSize);// starting game with new photo
                });

                $(':radio[name="level"]').change(function (e) {
                    startGame(images, $(this).val());// start game with level change.
                });
});



function startGame(images,gridSize){
    setImage(images,gridSize);
    $('#playPanel').show();
    $('#sortable').randomize();
    enableSwapping('#sortable li');

}

function setImage(images,gridSize){
    gridSize=gridSize || 3;
    let percentage=100/(gridSize-1);
    let image=images[Math.floor(Math.random() * images.length)];
    console.log(percentage);
    $('#imgTitle').html(image.title);
    $('#actualImage').attr('src', image.src);
    $('#sortable').empty(); // to empty image before showing the image.
    for (var i = 0; i < gridSize * gridSize; i++) {
        var xpos = (percentage * (i % gridSize)) + '%';
        var ypos = (percentage * Math.floor(i / gridSize)) + '%';
        console.log(xpos,ypos)
        
        var li = $('<li class="item" data-value="' + (i) + '"></li>').css({
            'background-image': 'url(' + image.src + ')',
            'background-size': (gridSize * 100) + '%',
            'background-position': xpos + ' ' + ypos,
            'width': 300 / gridSize,
            'height': 300 / gridSize
        });
        $('#sortable').append(li);
    }
     
    $('#sortable').randomize();
}

$.fn.randomize = function(selector){
    var $elems = selector ? $(this).find(selector) : $(this).children();
    for (var i = $elems.length; i >= 0; i--) {
        //console.log(Math.random() * i);
        console.log($elems[Math.random() * i | 0])
      $(this).append($elems[Math.random() * i | 0]);
    }
  
    return this;
  }

  function enableSwapping(elem){
    $(elem).draggable({
        /*snap: '#droppable',
        snapMode: 'outer',*/
        revert: 'invalid',
        helper: "clone"
    });
    $(elem).droppable({
        drop: function (event, ui) {
            //console.log($dragElem.attr('data-value'))
            //console.log(this)
            var $dragElem = $(ui.draggable).clone().replaceAll(this);
            
            $(this).replaceAll(ui.draggable);
        currentList = $('#sortable > li').map(function (i, el) { return $(el).attr('data-value'); });
           console.log(currentList);
            if (isSorted(currentList)){
                $('#actualImageBox').empty().html($('#gameOver').html());
                gameover=1;
            }
            else {
                var now = new Date().getTime();
                stepCount++;
                $('.stepCount').text(stepCount);
                //$('.timerCount').text(parseInt((now - startTime) / 1000, 10));
            }

            enableSwapping(this);
            enableSwapping($dragElem);
        }
    });
}

function isSorted(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] != i)
            return false;
    }
    return true;
}

setInterval(function(){
    if(gameover==0){
    let now = new Date().getTime();
   $('.timerCount').text(parseInt((now - startTime) / 1000, 10));
    }
    else{
    clearInterval();
    }

        
},1000)