function TechDiversityGender() {
  this.name = 'Tech Diversity: Gender';
  this.id = 'tech-diversity-gender';

  this.layout = {
    leftMargin: 130,
    rightMargin: width - 30,
    topMargin: 30,
    bottomMargin: height - 30,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    grid: true,
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  this.midX = (this.layout.plotWidth() / 2) + this.layout.leftMargin;
  this.femaleColour = color(255, 0, 0); // Red
  this.maleColour = color(0, 255, 0); // Green
  this.loaded = false;

  this.preload = function() {
    let self = this;
    this.data = loadTable(
      './data/tech-diversity/gender-2018.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function() {
    textSize(16);
    this.createColorPickers();
  };

  this.destroy = function() {};

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    this.drawCategoryLabels();
    let lineHeight = (height - this.layout.topMargin) / this.data.getRowCount();

    for (let i = 0; i < this.data.getRowCount(); i++) {
      let lineY = (lineHeight * i) + this.layout.topMargin;
      let company = {
        name: this.data.getString(i, 'company'),
        female: this.data.getNum(i, 'female'),
        male: this.data.getNum(i, 'male')
      };

      fill(0);
      noStroke();
      textAlign(RIGHT, TOP);
      text(company.name, this.layout.leftMargin - this.layout.pad, lineY);

      fill(this.femaleColour);
      rect(this.layout.leftMargin, lineY, this.mapPercentToWidth(company.female), lineHeight - this.layout.pad);
      
      fill(this.maleColour);
      rect(this.layout.leftMargin + this.mapPercentToWidth(company.female), lineY, this.mapPercentToWidth(company.male), lineHeight - this.layout.pad);
    }

    stroke(150);
    strokeWeight(1);
    line(this.midX, this.layout.topMargin, this.midX, this.layout.bottomMargin);
  };

  this.drawCategoryLabels = function() {
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    text('Female', this.layout.leftMargin, this.layout.pad);
    textAlign(CENTER, TOP);
    text('50%', this.midX, this.layout.pad);
    textAlign(RIGHT, TOP);
    text('Male', this.layout.rightMargin, this.layout.pad);
  };

  this.mapPercentToWidth = function(percent) {
    return map(percent, 0, 100, 0, this.layout.plotWidth());
  };

  // Create color pickers and show/hide based on the selected graph
  this.createColorPickers = function() {
    this.femaleColorPicker = createColorPicker('#FF0000'); // Default red
    this.femaleColorPicker.position(10, height + 20);
    this.femaleColorPicker.input(() => {
      this.femaleColour = color(this.femaleColorPicker.value());
    });

    this.maleColorPicker = createColorPicker('#00FF00'); // Default green
    this.maleColorPicker.position(160, height + 20);
    this.maleColorPicker.input(() => {
      this.maleColour = color(this.maleColorPicker.value());
    });

    this.labelFemale = createP('Female Colour:');
    this.labelFemale.position(10, height - 20);

    this.labelMale = createP('Male Colour:');
    this.labelMale.position(160, height - 20);

    // Initially hide color pickers
    this.femaleColorPicker.hide();
    this.maleColorPicker.hide();
    this.labelFemale.hide();
    this.labelMale.hide();
  };

  // Function to show or hide the color pickers based on the selected graph
  this.toggleColorPickers = function(isGenderGraph) {
    if (isGenderGraph) {
      this.femaleColorPicker.show();
      this.maleColorPicker.show();
      this.labelFemale.show();
      this.labelMale.show();
    } else {
      this.femaleColorPicker.hide();
      this.maleColorPicker.hide();
      this.labelFemale.hide();
      this.labelMale.hide();
    }
  };
}

