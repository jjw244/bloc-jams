// Example Album
var albumPicasso = {
        title: 'The Colors',
        artist: 'Pablo Picasso',
        label: 'Cubism',
        year: '1881',
        albumArtUrl: 'assets/images/album_covers/01.png',
        songs: [
            { title: 'Blue', duration: '4:26' },
            { title: 'Green', duration: '3:14' },
            { title: 'Red', duration: '5:01' },
            { title: 'Pink', duration: '3:21'},
            { title: 'Magenta', duration: '2:15'}
        ]
    };
 
 // Another Example Album
var albumMarconi = {
        title: 'The Telephone',
        artist: 'Guglielmo Marconi',
        label: 'EM',
        year: '1909',
        albumArtUrl: 'assets/images/album_covers/20.png',
        songs: [
            { title: 'Hello, Operator?', duration: '1:01' },
            { title: 'Ring, ring, ring', duration: '5:01' },
            { title: 'Fits in your pocket', duration: '3:21'},
            { title: 'Can you hear me now?', duration: '3:14' },
            { title: 'Wrong phone number', duration: '2:15'}
        ]
    };

var createSongRow = function (songNumber, songName, songLength) {
        var template =
            '<tr class="album-view-song-item">'
            + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
            + '  <td class="song-item-title">' + songName + '</td>'
            + '  <td class="song-item-duration">' + songLength + '</td>'
            + '</tr>';
 
        return template;
    };

var setCurrentAlbum = function (album) {
     // Select all of the HTML elements required to display on the album page: title, artist, release info, image, and song list.
        var albumTitle = document.getElementsByClassName('album-view-title')[0];
        var albumArtist = document.getElementsByClassName('album-view-artist')[0];
        var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
        var albumImage = document.getElementsByClassName('album-cover-art')[0];
        var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     // firstChild property identifies the first child node of an element, and  nodeValue returns or sets the value of a node.
        albumTitle.firstChild.nodeValue = album.title;
        albumArtist.firstChild.nodeValue = album.artist;
        albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
        albumImage.setAttribute('src', album.albumArtUrl);
 
     // Clear the album song list HTML to make sure there are no interfering elements.
        albumSongList.innerHTML = '';
 
     // Go through all the songs from the specified album object and insert them into the HTML using the innerHTML property. The createSongRow function is called at each loop, passing in the song number, name, and length arguments from our album object.
        for (var i = 0; i < album.songs.length; i++) {
            albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        }
 };

var findParentByClassName = function(element, targetClass) {
    
    if (element) {
        var currentParent = element.parentElement;
        while (currentParent.className != targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;
        }
        return currentParent;
    }
};

var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

var clickHandler = function(targetElement) {
    
    var songItem = getSongItem(targetElement);  
    
    if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }

 };

 // Elements to which we'll be adding listeners
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

 // Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

 // Store state of playing songs
var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);

    songListContainer.addEventListener('mouseover', function(event) {
        // Only target individual song rows during event delegation
         if (event.target.parentElement.className === 'album-view-song-item') {
             var songItem = getSongItem(event.target);

            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;            
            }
         }
     });
    
    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            // Cached song item in a variable
             var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number');
 
             // Added the conditional that checks that the item the mouse is leaving is not the current song, and we only change the content if it isn't.
             if (songItemNumber !== currentlyPlayingSong) {
                 //songItem.innerHTML = songItemNumber;
                 var songItem = getSongItem(event.target);

                if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                    songItem.innerHTML = playButtonTemplate;
                }
             }
        });
        
        songRows[i].addEventListener('click', function(event) {
             // Event handler call
            clickHandler(event.target);
         });
    }
}