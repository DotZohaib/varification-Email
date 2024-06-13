
document.querySelectorAll('.close-button').forEach(function (button) {
    button.addEventListener('click', function () {
      this.parentNode.remove();
    });
  });




  document.querySelector("#btn").addEventListener("click", function () {
    document.querySelector("#form input").click();
  });

  document.querySelector("#form").addEventListener("change", function () {
    document.querySelector("#form").submit();
  })




  document.querySelector("#contact").addEventListener("click", function () {
    window.location.href = "/contact";
  });
  