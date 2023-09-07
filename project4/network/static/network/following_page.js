/*
/// WITHOUT PAGINATION CODE
document.addEventListener('DOMContentLoaded', function(){
    document.querySelector("#following_posts").innerHTML = `<h3>Posts Following</h3>`;
    fetch(`people_following`)
    .then(response => response.json())
    .then(people => {
        people.forEach((person) => {
            fetch(`/view_post/${person.fields.following}`)
            .then(response => response.json())
            .then(posts => {
                posts.reverse().forEach((post) => {
                    var date = new Date(post.fields.timestamp)
                    var username = post.fields.username
                    document.querySelector("#following_posts").innerHTML += `<h5><a href="profile/${username}"><b>${username}<b></a></h5>`;
                    document.querySelector("#following_posts").innerHTML += `${post.fields.body} <br>`;
                    document.querySelector("#following_posts").innerHTML += `${date.toDateString()} at ${date.toLocaleTimeString()}<br>`;
                    document.querySelector("#following_posts").innerHTML += `<p>&#10084; ${post.fields.likes}</p><hr>`
                })
            })
        })
    })
})
*/
var posts_org = []
var count = 1
document.addEventListener('DOMContentLoaded',function(){
    document.querySelector("#title").innerHTML = `<h3>Posts Following</h3>`;
    fetch(`people_following`)
    .then(response => response.json())
    .then(people => {
        people.forEach((person) => {
            fetch(`/view_post/${person.fields.following}`)
            .then(response => response.json())
            .then(posts => {
                var array_len = posts.length
                if (array_len > 10){
                    var postPage_len = 0
                    var tracking = []
                    while (array_len > 10){
                        postPage_len = 10
                        tracking.push(postPage_len)
                        postPage_len = array_len
                        postPage_len = postPage_len - 10
                        array_len = array_len - 10
                        if (postPage_len <= 10){
                            tracking.push(postPage_len)
                        }
                    }
                    reversed = posts.reverse()
                    tracking.forEach((page) => {
                        if (page == 10){
                            max = page*count
                            min = (page*count)-10
                            send_post = reversed.slice(min,max)
                        }
                        else {
                            max = posts.length
                            min = 10*(count-1)
                            send_post = reversed.slice(min,max)
                        }
                        posts_org.push(send_post)
                        document.querySelector("#pagination_buttons").innerHTML += `<button id='${count}' onclick = "page('${count}')">${count}</button>`;
                        count = count + 1;
                    })
                    page(1)
                }
                else {
                    posts.reverse().forEach((post) => {
                        var date = new Date(post.fields.timestamp)
                        var username = post.fields.username
                        document.querySelector("#following_posts").innerHTML += `<h5><a href="profile/${username}"><b>${username}<b></a></h5>`;
                        document.querySelector("#following_posts").innerHTML += `${post.fields.body} <br>`;
                        document.querySelector("#following_posts").innerHTML += `${date.toDateString()} at ${date.toLocaleTimeString()}<br>`;
                        document.querySelector("#following_posts").innerHTML += `<p id = "like${post.pk}" onclick = "liked('${post.pk}','${post.fields.likes}')">&#128077; ${post.fields.likes}</p><hr>`;
                    })
                }
            })
        })
    })
})

function page(posts){
    posts = parseInt(posts)
    var style_count = 1
    var style_array = []
    while (style_count < count) {
        adding = style_array.push(style_count)
        style_count = style_count + 1
    }
    style_array.forEach((number) => {
        document.getElementById(number).style.backgroundColor = "white";
    })
    document.getElementById(posts).style.backgroundColor = "lightgreen";
    if (posts > 1) {
        document.querySelector("#prev_next").innerHTML = `<button onclick = "page('${posts-1}')">Previous</button>`;
        document.querySelector("#prev_next").innerHTML += `<button onclick = "page('${posts+1}')">Next</button>`;
    }
    else {
        document.querySelector("#prev_next").innerHTML = `<button onclick = "page('${posts+1}')">Next</button>`;
    }
    this_post = posts_org[posts-1]
    document.querySelector("#following_posts").innerHTML = ` `;
    this_post.forEach((post) => {
        var date = new Date(post.fields.timestamp)
        var username = post.fields.username
        document.querySelector("#following_posts").innerHTML += `<h5><a href="profile/${username}"><b>${username}<b></a></h5>`;
        document.querySelector("#following_posts").innerHTML += `${post.fields.body} <br>`;
        document.querySelector("#following_posts").innerHTML += `${date.toDateString()} at ${date.toLocaleTimeString()}<br>`;
        document.querySelector("#following_posts").innerHTML += `<p id = "like${post.pk}" onclick = "liked('${post.pk}','${post.fields.likes}')">&#128077; ${post.fields.likes}</p><hr>`;
    })
}


liked_user_post = JSON.parse(localStorage.getItem('liked_names')) || []
localStorage.setItem('liked_names', JSON.stringify(liked_user_post));

function liked(post_pk, num_likes) {
    current_user = document.getElementById("current_user").value //change
    current_list = JSON.parse(localStorage.getItem('liked_names'))
    count = 0
    if (current_list.length > 0){
        check_str = `${current_user},${post_pk}`
        if (current_list.includes(`${check_str}`)){
            document.querySelector(`#like${post_pk}`).innerHTML = `&#128077; ${num_likes}`;
            fetch(`liked/${post_pk}`, {
                method: 'PUT',
                body: JSON.stringify({
                    likes: num_likes
                })
            })
            let liked = JSON.parse(localStorage.getItem('liked_names'));
            del_position = current_list.indexOf(`${check_str}`)
            liked.splice(del_position,1)
            localStorage.setItem('liked_names', JSON.stringify(liked));      
        }
        else {
            num_likes = parseInt(num_likes) + 1
            document.querySelector(`#like${post_pk}`).innerHTML = `&#128077; ${num_likes}`
            fetch(`liked/${post_pk}`, {
                method: 'PUT',
                body: JSON.stringify({
                    likes: num_likes
                })
            })
            new_str = `${current_user},${post_pk}`
            let liked = JSON.parse(localStorage.getItem('liked_names'));
            liked.push(new_str)
            localStorage.setItem('liked_names', JSON.stringify(liked)); 
        }
    }
    else {
        num_likes = parseInt(num_likes) + 1
        document.querySelector(`#like${post_pk}`).innerHTML = `&#128077; ${num_likes}`
        fetch(`liked/${post_pk}`, {
            method: 'PUT',
            body: JSON.stringify({
                likes: num_likes
            })
        })    
        current_user = document.getElementById("current_user").value //change
        new_str = `${current_user},${post_pk}`
        let liked = JSON.parse(localStorage.getItem('liked_names'));
        liked.push(new_str)
        localStorage.setItem('liked_names', JSON.stringify(liked));    
    }
}