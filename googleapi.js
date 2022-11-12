function initMap(){
    var  pos= { lat:51.09112508957857 , lng:71.41845264312275};
    var opt= {
        center:{ lat:51.09112508957857 , lng:71.41845264312275},
        zoom: 16
    }
    var myMap = new google.maps.Map(document.getElementById("map"), opt);
    var marker = new google.maps.Marker({
        position: pos,
        map: myMap,
        title: "there will be a cs:go tournament"
    })

}
function scrollWin() {
    window.scrollBy(0, 1810);
}