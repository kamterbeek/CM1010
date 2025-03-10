function TechDiversityRace() {
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Tech Diversity: Race';

  // Each visualisation must have a unique ID with no special characters.
  this.id = 'tech-diversity-race';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      './data/tech-diversity/race-2018.csv',
      'csv',
      'header',
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Create a select DOM element.
    this.select = createSelect();

    // Position the select element (moved 300 pixels to the right).
    this.select.position(375, 50);

    // Fill the options with all company names dynamically.
    var companyNames = this.data.columns.slice(1); // Exclude the first column (labels)
    for (let i = 0; i < companyNames.length; i++) {
      this.select.option(companyNames[i]);
    }

    // Set the default selected value
    this.select.selected(companyNames[0]);

    // Redraw the chart when a new company is selected.
    this.select.changed(() => this.draw());
  };

  this.destroy = function () {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function () {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the selected company name from the dropdown.
    var companyName = this.select.value();

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(companyName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['blue', 'red', 'green', 'pink', 'purple', 'yellow'];

    // Make a title.
    var title = 'Employee diversity at ' + companyName;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
  };
}
