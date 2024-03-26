# Project Name: Logic Inspect

![screenshot](https://github.com/logic-inspect/logic-inspect.github.io/assets/164509556/81e64a38-e41a-4e99-8a4d-e5886c208c10)

## Description
Logic Inspect created for the analysis and visualization of LIN bus data packages, exclusively working with Saleae Logic 2 captured packages. It relies on CSV files exported in a HEX byte format from the Saleae Logic 2 software. This project facilitates a deep dive into LIN bus communications, offering insights into package changes and trends over time.

## How to Use
- Use Saleae Logic 2 to capture LIN bus data.
- Export the captured data to a CSV file, ensuring the byte format is HEX.
- Visit https://logic-inspect.github.io to access the tool.
- Use the "Upload CSV" button to load your CSV file into the tool.

## Features
Logic Inspect offers two primary modes for data visualization:

- `Statistics View:` Displays a history of package changes, grouped by package ID. This view is ideal for analyzing the changes occurring over time.
- `Table View:` Allows users to navigate through packages using left and right arrow keyboard keys, showing the packages in the order they were captured.

## Code Generation Button
When users press the button to generate code based on the packet data, the generated code relies on a modified version of the Lin [Transceiver Library](https://github.com/mestrode/Lin-Transceiver-Library)
