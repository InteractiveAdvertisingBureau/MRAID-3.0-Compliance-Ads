# MRAID 3.0 Viewability Compliance Ad

This sample ad allows a user to track the exposed percentage values that a MRAID 3.0 SDK returns over time.

The data is presented as a histogram with the vertical axis representing the exposedPercentage value.

Each node on the horizontal axis represents a single exposureChange event.

## Getting Started

Clone this repository to your development environment and run the markup in ad.html in an ad webview on the target SDK.

Note: this ad requires at least 100px of vertical space so that the lines of the chart can render legibly.

## Error Messages

If the ad detects one of the following scenarios, it will attempt to display a message describing the problem.
* No object named mraid is defined after loading mraid.js
* The global variable MRAID_ENV is undefined
* The function mraid.getVersion returns a version that is not either a numeric or string representation of the number 3
* When handling an exposureChange event, the exposedPercentage parameter does not match the MRAID 3.0 specification for that object
* When handling an exposureChange event, the visibleRectangle object (if not null) does not match the MRAID 3.0 specification for that object
* When handling an exposureChange event, the occlusionRectangles array (if not null) does not match the MRAID 3.0 specification for that array

### Demo

Open mockTester.html in a browser to see a demonstration of what the output should look like under happy path conditions.

## Authors

* **Patrick Brady**

See also the list of [contributors](https://github.com/InteractiveAdvertisingBureau/MRAID-3.0-Compliance-Ads/contributors) who participated in this project.

## Acknowledgments

* This project uses the Chart.js library http://chartjs.org/
