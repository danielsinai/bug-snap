# BugSnap 🐞

BugSnap is a desktop app designed to streamline bug reporting directly from your screen to Jira. It captures the last 5 seconds of your screen as a video when you encounter a bug, allowing you to create Jira tickets effortlessly.

## Features

- **Simple Bug Reporting**: Capture bugs with a quick keyboard shortcut (`Cmd/Ctrl + Alt + J`) and annotate them with title, description, and urgency.
- **Integrated with Jira**: Seamlessly create Jira issues with captured videos as attachments, ensuring detailed bug reports.
- **Flexible Capture**: Choose between capturing a desktop window or the entire screen.
- **Future Integrations**: Currently supports Jira; future updates will include integrations with more tools for enhanced workflow support.

## Installation

To get started, simply download the latest release for your platform from the [releases page](https://github.com/danielsinai/bug-snap/releases/). 

## Usage

1. Configure BugSnap with your Jira instance URL and personal access token.
2. Select your preferred capture mode: desktop window or full screen.
3. When you encounter a bug, press `Cmd/Ctrl + Alt + J` to capture the last 5 seconds as a video.
4. Fill out the bug details (title, description, urgency) in the pop-up form.
5. Click a button to create a Jira ticket with the captured video attached.

## Limitations and Future Enhancements

BugSnap is a work in progress:
- Occasionally captures multiple parts of a video instead of a single segment.
- Currently operates as a visible window rather than running in the background.
- Future updates will focus on adding more integrations and improving video capture stability.

## Contributing

Contributions are welcome! To contribute to BugSnap, fork the repository and submit a pull request with your proposed changes.

## License

This project is licensed under the [MIT License](https://github.com/danielsinai/bug-snap/blob/main/LICENSE.md).
