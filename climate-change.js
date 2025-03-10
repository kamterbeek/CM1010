function ClimateChange() {
  this.name = 'Climate Change';
  this.id = 'climate-change';
  this.xAxisLabel = 'year';
  this.yAxisLabel = '℃';
  
  var marginSize = 35;
  this.layout = {
    marginSize: marginSize,
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,
    plotWidth: function() { return this.rightMargin - this.leftMargin; },
    plotHeight: function() { return this.bottomMargin - this.topMargin; },
    grid: false,
    numXTickLabels: 8,
    numYTickLabels: 8,
  };

  this.loaded = false;
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/surface-temperature/surface-temperature.csv', 'csv', 'header',
      function(table) { self.loaded = true; }
    );
  };

  this.setup = function() {
    textSize(16);
    textAlign('center', 'center');
    this.minYear = this.data.getNum(0, 'year');
    this.maxYear = this.data.getNum(this.data.getRowCount() - 1, 'year');
    this.minTemperature = min(this.data.getColumn('temperature'));
    this.maxTemperature = max(this.data.getColumn('temperature'));
    this.meanTemperature = mean(this.data.getColumn('temperature'));
    this.frameCount = 0;

    this.startSlider = createSlider(this.minYear, this.maxYear - 1, this.minYear, 1);
    this.startSlider.position(400, 10);

    this.endSlider = createSlider(this.minYear + 1, this.maxYear, this.maxYear, 1);
    this.endSlider.position(600, 10);
  };

  this.destroy = function() {
    this.startSlider.remove();
    this.endSlider.remove();
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    if (this.startSlider.value() >= this.endSlider.value()) {
      this.startSlider.value(this.endSlider.value() - 1);
    }
    this.startYear = this.startSlider.value();
    this.endYear = this.endSlider.value();

    drawYAxisTickLabels(this.minTemperature, this.maxTemperature, this.layout, this.mapTemperatureToHeight.bind(this), 1);
    drawAxis(this.layout);
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);
    
    stroke(200);
    strokeWeight(1);
    line(this.layout.leftMargin, this.mapTemperatureToHeight(this.meanTemperature), this.layout.rightMargin, this.mapTemperatureToHeight(this.meanTemperature));

    var previous;
    var numYears = this.endYear - this.startYear;
    var segmentWidth = this.layout.plotWidth() / numYears;
    var yearCount = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      var current = {
        'year': this.data.getNum(i, 'year'),
        'temperature': this.data.getNum(i, 'temperature')
      };

      if (previous != null && current.year > this.startYear && current.year <= this.endYear) {
        noStroke();
        fill(this.mapTemperatureToColour(current.temperature));
        rect(
          this.mapYearToWidth(previous.year),
          this.layout.topMargin,
          segmentWidth,
          this.layout.plotHeight()
        );

        stroke(0);
        line(
          this.mapYearToWidth(previous.year),
          this.mapTemperatureToHeight(previous.temperature),
          this.mapYearToWidth(current.year),
          this.mapTemperatureToHeight(current.temperature)
        );

        var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);
        if (yearCount % xLabelSkip == 0) {
          drawXAxisTickLabel(previous.year, this.layout, this.mapYearToWidth.bind(this));
        }

        if (numYears <= 6 && yearCount == numYears - 1) {
          drawXAxisTickLabel(current.year, this.layout, this.mapYearToWidth.bind(this));
        }
        yearCount++;
      }

      if (yearCount >= this.frameCount) {
        break;
      }
      previous = current;
    }
    this.frameCount++;
    if (this.frameCount >= numYears) {
      //noLoop();
    }
  };

  this.mapYearToWidth = function(value) {
    return map(value, this.startYear, this.endYear, this.layout.leftMargin, this.layout.rightMargin);
  };

  this.mapTemperatureToHeight = function(value) {
    return map(value, this.minTemperature, this.maxTemperature, this.layout.bottomMargin, this.layout.topMargin);
  };

  this.mapTemperatureToColour = function(value) {
    var red = map(value, this.minTemperature, this.maxTemperature, 0, 255);
    var blue = 255 - red;
    return color(red, 0, blue, 100);
  };
}
