$(document).ready(function ()
{
    // CANVAS & MOBILE TEST
    var windowWidth = $(window).width(),
        windowHeight = $(window).height();
    var isMobile = navigator.userAgent.match(/mobile/i);
    var webGLTrue = false;

    // CLASSES
    if (isMobile)
    {
        $("body").addClass("mobile");
    } else if (!isMobile)
    {
        $("body").addClass("desktop");
    }

    var screenShotCanvas,
        canvasDataURL,
        canvasImage,
        screenCaptured = false;

    if (webGLTrue)
    {
        captureScreen();
    }
    initialLoader();

    // DEBOUNCE FUNCTION
    function debounce(func, wait, immediate)
    {
        var timeout;

        return function ()
        {
            var context = this, args = arguments;
            var later = function ()
            {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    var debounceAdjust = debounce(function ()
    {
        widowControl();
    }, 50);

    window.addEventListener("resize", debounceAdjust);

    // WIDOW CONTROL
    function widowControl()
    {
        windowWidth = $(window).width();
        var widowElements = $("h1, h2, h3, h4, h5, h6, li, p, figcaption, .case-study-tagline, .large-cta").not(".discovery_cell p, #site-nav li, footer li");


        widowElements.each(function ()
        {
            $(this).html($(this).html().replace(/&nbsp;/g, " "));
        });

        if (windowWidth > 640)
        {
            widowElements.each(function ()
            {
                $(this).html($(this).html().replace(/\s((?=(([^\s<>]|<[^>]*>)+))\2)\s*$/, "&nbsp;$1"));
            });
        }
    };

    // HTML CANVAS & INITIAL LOAD FUNCTIONS
    function captureScreen()
    {
        html2canvas($(".ajax"), {
            letterRendering: true,
            allowTaint: true,
            onrendered: function (canvas)
            {
                screenShotCanvas = canvas;
                canvasDataURL = screenShotCanvas.toDataURL();
                canvasImage = new Image();
                canvasImage.src = canvasDataURL;
                screenCaptured = true;
                console.log(canvas);
            }
        });

    }

    function initialLoader()
    {
        $("body").removeClass("noscroll");

        var loadText = "Warning: Intrusion detected.";
        var loaderDone = false;
        $.each(loadText.split(""), function (i, letter)
        {
            setTimeout(function ()
            {
                $("#loader-text").html($("#loader-text").html() + letter);
            }, 60 * i);
        });

        setTimeout(function ()
        {
            loaderDone = true;
        }, 1700);


        //check to make sure the document has been fully loaded before removing loader
        var readyStateCheckInterval = setInterval(function ()
        {
            if (document.readyState === "complete" && loaderDone)
            {
                clearInterval(readyStateCheckInterval);
                $("#initial-loader").velocity({
                        translateZ: 0,
                        opacity: 0
                    },
                    {
                        display: "none",
                        delay: 0,
                        duration: 800
                    });


                if (webGLTrue)
                {
                    loadPageCanvas();

                    setTimeout(function ()
                    {
                        removePageCanvas();
                        $("#initial-loader").remove();
                    }, 500);
                } else
                {
                    setTimeout(function ()
                    {
                        $("#initial-loader").remove();
                    }, 1001);
                }
            }
        }, 10);
    }
});
