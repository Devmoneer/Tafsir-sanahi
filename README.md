# Prayer Times for Kurdistan Cities

A lightweight, open-source website for browsing daily prayer schedules across cities in Kurdistan. The site uses plain HTML, CSS, and JavaScript and loads its schedules from the JSON files in `data/`.

## Features

- Browse schedules for 36 cities.
- Choose a city and date to see Fajr, sunrise, Dhuhr, Asr, Maghrib, and Isha.
- Responsive layout with no JavaScript packages or build step.
- Clear notice when a schedule is unavailable or cannot be loaded.

## Run locally

The page fetches JSON files, so open it through a local web server rather than directly as a `file://` URL.

1. Clone or download this repository.
2. Open a terminal in the project folder.
3. Start Python's built-in web server:

   ```sh
   python -m http.server 8000
   ```

   On Windows, `py -m http.server 8000` may be used if the `python` command is unavailable.

4. Visit [http://localhost:8000](http://localhost:8000) in your browser.

No package installation or build command is required. To publish the site, serve the repository's static files from any static web host, keeping the `data/` directory alongside `index.html`.

## Project structure

```text
.
├── index.html       # Page content and search/social metadata
├── styles.css       # Responsive visual design
├── app.js           # City/date selection and schedule display
└── data/
    ├── Hawler.json
    └── ...          # One schedule file per city
```

## Schedule data

Each city file is a JSON array of schedule objects. The website matches the `Date` value in `MM-DD` format and displays the time values as stored; the selected year is not part of the data. Some files may have missing dates or multiple entries for the same date. If duplicate entries contain different times, the website reports the conflict instead of choosing one.

```json
{
  "ID": 1,
  "Date": "01-01",
  "Fajr": "06:02",
  "Sunrise": "07:21",
  "Dhuhr": "12:16",
  "Asr": "02:45",
  "Maghrib": "05:06",
  "Isha": "06:21"
}
```

The dataset currently does not document its source, calculation method, or time zone. The site does not calculate or adjust prayer times. Please verify important times with a trusted local source.

## Contributing

Contributions are welcome:

1. Fork the repository and create a branch for your change.
2. Keep each city's JSON filename and schedule schema consistent with the existing files.
3. If you add or correct prayer data, include its source, calculation method, time zone, and coverage dates in your contribution.
4. Test the page locally by changing the city and date, and check that unavailable dates show a clear message.
5. Open a pull request describing the change.

Please avoid presenting unverified schedules as authoritative. If you find an issue, open a GitHub issue with the city, date, and correction or data source.

## License

No license is currently specified in this repository. Before reusing or redistributing the code or schedule data, check the repository for a license or ask the project maintainers to add one.