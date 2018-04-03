# Super Simple Alpha Example of using Mura as a Headless CMS
This is just an example to build upon and in no way represents best practice. You most like would use a web component framework like React.js or Vue.js with Mura.js rather than vanilla js.

## For this to work:

You must be on Mura 7.1.137 or greater

set your site's contentRenderer.cfc's this.hashURLs=true;

Edit the js/app.js to use your site's siteID and rootpath

```
var MuraHeadlessConfig={
	siteid:'headless',
	rootpath:'http://headless.mura.local:8080',
	containerSelector:'body'
};
```

In your site's settings, set the following attributes

* Domain= The domain of the remote site that the the content will be served on.
* Is Remote = true
* Remote Context = The directory structure off of the remote site's web root that the site lives
* Remote Port = The port of the remote site
* Resource Domain = The domain that Mura will use the access resource like css and js scripts that are dynamically loaded.
* Reload Mura and test.

## Also:

Since Mura calendars uses fullcalendar.js you'll need to also include jQuery if needed.

If you run into CORS errors including from from the resource domain you will need to add Access-Control-Allow-Origin header to your Mura instances web server
