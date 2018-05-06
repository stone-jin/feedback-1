import domtoimage from 'dom-to-image';

/* 监听对应的反馈按钮的事件 */
document
  .getElementById ('feedback')
  .addEventListener ('click', function (event) {
    var node = document.getElementsByTagName ('body')[0];
    var csv = document.getElementById ('csv');

    var pos = {
      x: 0,
      y: 0,
    };
    var ctx = null;

    function draw (e) {
      if (e.buttons !== 1) return;

      ctx.beginPath ();

      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'red';

      ctx.moveTo (pos.x, pos.y); // from
      setPosition (e);
      ctx.lineTo (pos.x, pos.y); // to

      ctx.stroke (); // draw it!
    }

    function setPosition (e) {
      pos.x = e.clientX - csv.getBoundingClientRect ().left;
      pos.y = e.clientY - csv.getBoundingClientRect ().top;
    }

    domtoimage
      .toPng (node)
      .then (function (dataUrl) {
        var img = new Image ();
        img.src = dataUrl;
        img.onload = () => {
          ctx = csv.getContext ('2d');
          csv.width = document
            .getElementsByTagName ('body')[0]
            .getBoundingClientRect ().width;
          csv.height = document
            .getElementsByTagName ('body')[0]
            .getBoundingClientRect ().height;
          ctx.drawImage (img, 0, 0);
          csv.addEventListener ('mousemove', draw.bind (this));
          csv.addEventListener ('mousedown', setPosition.bind (this));
          csv.addEventListener ('mouseenter', setPosition.bind (this));
        };
      })
      .catch (function (error) {
        console.error ('oops, something went wrong!', error);
      });
  });
