$(document).ready(function(){

  // check to see if the template we're creating is a duplicate of an existing template
  const urlParams = new URLSearchParams(window.location.search);
  window.history.replaceState({}, document.title, "/create-template");  // clean the url search params from the URL

  window.initHtml();

  if (urlParams.has('d-origin')) {
    // we need to load the existing template from which we will duplicate
    $.get(`/get-template/${urlParams.get('d-origin')}?region=${localStorage.getItem('region')}`, function (response) {
      $('#templateName').val(urlParams.get('d-name'));
      $('#templateSubject').val(response.data.SubjectPart);
      $('#templateText').val(response.data.TextPart);
      $('#codeMirror').val(response.data.HtmlPart || "");
      window.initHtml();
    });
  }

  // handle form submissions
  $('#createTemplateForm').submit(function(e) {
    e.preventDefault();

    const createPayload = {
      "TemplateName": $('#templateName').val(),
      "HtmlPart": tinymce.get("codeMirror").getContent(),
      "SubjectPart": $('#templateSubject').val(),
      "TextPart": $('#templateText').val(),
      "region": localStorage.getItem('region')
    };

    $.ajax({
      type: "POST",
      url: "/create-template",
      data: createPayload,
      success: function() {
        window.location.href = '/';
      },
      error: function(xhr) {
        let content;
        if (xhr.responseJSON.message) {
          content = xhr.responseJSON.message;
        } else {
          content = "Error saving template. Please try again";
        }
        $('#errContainer').html(content).removeClass('d-none');
      }
    });
  });

});
