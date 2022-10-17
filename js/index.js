document.location.hash = '#tab-ov';

$('.navbar-tab').each(function() {
    $(this).click(function() {
        $('.navbar-tab').removeClass('current-tab');
        $(this).addClass('current-tab');
    });
});

respondToVisibility = function(element, callback) {
    let options = {
        root: document.documentElement
    }
    let observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                callback(entry.intersectionRatio > 0);
            });
        }, options);
    observer.observe(element);
}