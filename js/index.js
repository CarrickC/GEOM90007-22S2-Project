document.location.hash = '#tab-ov';

$('.navbar-tab').each(function () {
    $(this).click(function () {
        $('.navbar-tab').removeClass('current-tab');
        $(this).addClass('current-tab');
    });
});

respondToVisibility = function (element, callback) {
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

 anychart.onDocumentReady(function () {

     // add data

     var data = [
         ["Jan", 14774380, 16966847, 7927612],
         ["Feb", 16040904, 19792614, 10333573],
         ["Mar", 16297302, 19552255, 10301701],
         ["Apr", 11898764, 13685871, 6922504],
         ["May", 12896498, 16494726, 8628232],
         ["Jun", 11652855, 14938796, 7931778],
         ["Jul", 12153032, 15155783, 7748407],
         ["Aug", 12406163, 15690762, 8345273],
         ["Sep", 10957316, 14193696, 7385466],
         ["Oct", 12575151, 16039353, 8766030],
         ["Nov", 12418075, 15886289, 8856295],
         ["Dec", 11712064, 14141290, 7561703]
     ];

     // create a data set
     var dataSet = anychart.data.set(data);

     // map the data for all series
     var firstSeriesData = dataSet.mapAs({
         x: 0,
         value: 1
     });
     var secondSeriesData = dataSet.mapAs({
         x: 0,
         value: 2
     });
     var thirdSeriesData = dataSet.mapAs({
         x: 0,
         value: 3
     });

     // create a line chart
     var chart = anychart.line();

     // create the series and name them
     var firstSeries = chart.line(firstSeriesData);
     firstSeries.name("Tram");
     var secondSeries = chart.line(secondSeriesData);
     secondSeries.name("Train");
     var thirdSeries = chart.line(thirdSeriesData);
     thirdSeries.name("Bus");

     // add a legend
     chart.legend().enabled(true);

     // add a title
     chart.title("Average Monthly Public Transport Flow From 2018 To 2020");

     // specify where to display the chart
     chart.container("overview_chart");

     // draw the resulting chart
     chart.draw();

 });

