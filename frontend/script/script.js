$(document).ready(function () {
  $("#attendentType").change(function () {
    $("#attendentTypeForm").submit();
  });

  //   --------------------------------------- About Section data fetching -----------------------------------------------
  // <h2 class="workshop-title text-center mb-4">${data.title}</h2>
  $.getJSON("./data/about_workshop.json", function (data) {
    const content = `
    <div class="about-workshop-content p-4">
      <p class="workshop-description mb-4">
        ${data.description.replace(/\n/g, "<br><br>")}
      </p>

      <h4 class="workshop-title mt-4">Highlights of the Conference:</h4>
      <ul class="highlight-list mb-4">
        ${data.highlights
          .map((point) => `<li class="highlight-item"> ${point}</li>`)
          .join("")}
      </ul>

      
    </div>`;
    $("#about-workshop-section").html(content);
  });

  // -------------------------------------------------- COnference Theme Section -------------------------------------------------------

  $.getJSON("./data/conference_theme.json", function (data) {
    // Workshop Theme
    let workshopHTML = `<h3>${data.workshopTheme.title}</h3>`;
    workshopHTML += `<p>${data.workshopTheme.description}</p><ul>`;
    data.workshopTheme.topics.forEach((topic) => {
      workshopHTML += `<li>${topic}</li>`;
    });
    workshopHTML += `</ul>`;
    $("#workshop-theme").html(workshopHTML);

    // Conference Theme
    let conferenceHTML = `<h3>${data.conferenceThemes.title}</h3><ul>`;
    conferenceHTML += `<p>${data.conferenceThemes.description}</p><ul>`;

    data.conferenceThemes.topics.forEach((topic) => {
      conferenceHTML += `<li>${topic}</li>`;
    });
    conferenceHTML += `</ul>`;
    $("#conference-theme").html(conferenceHTML);

    // Highlights Section (optional - if you have a container like #highlights)
    if (data.highlights) {
      let highlightsHTML = `<h3>${data.highlights.title}</h3><ul>`;
      data.highlights.points.forEach((point) => {
        highlightsHTML += `<li>${point}</li>`;
      });
      highlightsHTML += `</ul><p>${data.highlights.summary}</p>`;
      $("#highlights").html(highlightsHTML);
    }
  });

  // ---------------------------------------------------- Important Dates Section -----------------------------------------------------

  $.getJSON("./data/important_dates.json", function (data) {
    const content = `
        <div class="important-dates-content p-4">
          <h2 class="dates-title text-center mb-4">${data.title}</h2>
          <ul class="dates-list list-group list-group-flush">
            ${data.dates
              .map(
                (item) => `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="event-name">${item.event}</span>
                <span class="event-date">${item.date}</span>
              </li>`
              )
              .join("")}
          </ul>
        </div>`;
    $("#important-dates-section .shadow-lg").html(content);
  });

  //   -------------------------------------------------- Workshop Schedule Section ----------------------------------------------------------------------------

  // $.getJSON("./data/workshop_schedule.json", function (data) {
  //   let scheduleHTML = "";
  //   data.schedule.forEach((dayObj, index) => {
  //     scheduleHTML += `
  //         <div class="col-md-6">
  //           <div class="schedule-card p-3 h-100">
  //             <h5 class="schedule-day mb-3">${dayObj.day}</h5>
  //             <ul class="list-group list-group-flush">
  //               ${dayObj.sessions
  //                 .map(
  //                   (session) => `
  //                 <li class="list-group-item">
  //                   <strong>${session.time}</strong><br/>
  //                   ${session.topic}
  //                 </li>
  //               `
  //                 )
  //                 .join("")}
  //             </ul>
  //           </div>
  //         </div>
  //       `;
  //   });
  //   $("#schedule-container").html(scheduleHTML);
  // });

  $.getJSON("./data/workshop_schedule.json", function (data) {
    let scheduleHTML = "";

    // Override all schedule data with TBA
    const tbaDays = ["Day 1", "Day 2", "Day 3"];
    tbaDays.forEach((day) => {
      scheduleHTML += `
      <div class="col-md-6">
        <div class="schedule-card p-3 h-100">
          <h5 class="schedule-day mb-3">${day} (To Be Announced)</h5>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <strong>TBA</strong><br/>
              TBA
            </li>
            <li class="list-group-item">
              <strong>TBA</strong><br/>
              TBA
            </li>
            <li class="list-group-item">
              <strong>TBA</strong><br/>
              TBA
            </li>
          </ul>
        </div>
      </div>
    `;
    });

    $("#schedule-container").html(scheduleHTML);
  });

  // ---------------------------------- Intended Audience Section -------------------------------------------------------

  $.getJSON("./data/intended_audience.json", function (data) {
    $("#audience-title").text(data.title);
    $("#audience-desc").text(data.description);

    let cardsHTML = "";
    data.audience.forEach((person) => {
      cardsHTML += `
      <div class="audience-card">
        <img src="${person.image}" alt="${person.title}" class="audience-icon">
        <h3>${person.title}</h3>
        <p>${person.description}</p>
      </div>
    `;
    });

    $("#audience-cards-container").html(cardsHTML);
  });

  // ------------------------- to Committee Members data ------------------------------------------------------------

  $.getJSON("./data/committee_data.json", function (data) {
    const container = $("#committee-container");

    $.each(data, function (committeeName, members) {
      const section = $('<div class="committee-section col-12"></div>');
      section.append(`<div class="section-title">${committeeName}</div>`);

      const row = $('<div class="row"></div>');

      $.each(members, function (i, member) {
        const card = $(`
            <div class="col-md-4 col-sm-6">
              <div class="custom-card cursor-pointer text-center" 
              onclick="window.location.href='${member.link}'"
              >
                <img src="${member.image}" alt="${member.name}" class="member-img mb-3">
                <h5>${member.name}</h5>
                <p>${member.affiliation}</p>
              </div>
            </div>
          `);
        row.append(card);
      });

      section.append(row);
      container.append(section);
    });
  });

  // ------------------------- to display speakers data ------------------------------------------------------------

  $.getJSON("./data/invited_speaker_data.json", function (data) {
    const container = $("#speakers-container");

    data.speakers.forEach((speaker, index) => {
      const tagClass =
        speaker.speakerType === "fixed" ? "tag-fixed" : "tag-tentative";
      if (speaker?.hidden) return;

      const interests = speaker.researchInterests || [];
      // const interestsPreview = interests
      //   .slice(0, 3)
      //   .map((i) => `<li>${i}</li>`)
      //   .join("");

      // const interestsHidden = interests
      //   .slice(3)
      //   .map((i) => `<li class="hidden-interest hidden-${index}">${i}</li>`)
      //   .join("");

      // const showMoreBtn =
      //   interests.length > 3
      //     ? `<button class="show-more" onclick="event.stopPropagation(); toggleMore(this, ${index})">More</button>`
      //     : "";

      // <ul class="speaker-interests">
      //   ${interestsPreview}
      //   ${interestsHidden}
      // </ul>
      // ${showMoreBtn}

      const card = `
      <div class="speaker-card" data-link="${speaker.link}">
        <img src="${speaker.image}" alt="${speaker.name}" class="speaker-image" />
        <div class="speaker-body">
          <div class="speaker-name">${speaker.name}</div>
          <div class="speaker-affiliation">${speaker.affiliation}</div>
      
          <div class="speaker-tag ${tagClass}">${speaker.speakerType}</div>
        </div>
      </div>
    `;

      container.append(card);
    });
  });

  // ----------------- More btn click ---------------------------------------------------------------------------

  $(document).on("click", ".speaker-card", function () {
    const link = $(this).data("link");
    window.open(link, "_blank"); // open in new tab
  });

  //   --------------------------------------- Registration Notes Data fetch ------------------------------------------------------------
  let feeData = {};

  $.getJSON("./data/registration_fees_and_notes.json", function (data) {
    feeData = data["RegistrationFee (Including 18% GST)"];

    // Render tables at top
    renderDetailedFeeTable("#conferenceTable", feeData["Conference"]);
    renderDetailedFeeTable(
      "#workshopConfTable",
      feeData["Conference and Workshop"]
    );

    if (data.Notes) {
      data.Notes.forEach((note) => {
        $("#notesList").append(`<li>${note}</li>`);
      });
    }
  });

  function renderDetailedFeeTable(targetId, feeData) {
    let html = "";

    Object.keys(feeData).forEach((nationality) => {
      html += `<h5 class="mt-4">${nationality}</h5>`;

      const membershipGroups = feeData[nationality];
      const hasMembershipGroups =
        typeof membershipGroups === "object" &&
        !Array.isArray(membershipGroups) &&
        Object.values(membershipGroups)[0] instanceof Object;

      if (
        hasMembershipGroups &&
        Object.keys(membershipGroups)[0] !==
          "Students (UG/ PG/ Research Scholars)"
      ) {
        Object.keys(membershipGroups).forEach((membershipType) => {
          html += `<h6 class="mt-2">${membershipType}</h6>`;
          html += `<div class="table-wrapper"><table class="custom-table"><thead><tr><th>Category</th><th>Fee</th></tr></thead><tbody>`;

          const categoryFees = membershipGroups[membershipType];
          Object.keys(categoryFees).forEach((category) => {
            const fee = categoryFees[category];
            html += `
              <tr>
                <td>${category}</td>
                <td>${fee}</td>
              </tr>
            `;
          });

          html += `</tbody></table></div>`;
        });
      } else {
        html += `<div class="table-wrapper"><table class="custom-table"><thead><tr><th>Category</th><th>Fee</th></tr></thead><tbody>`;
        Object.keys(membershipGroups).forEach((category) => {
          const fee = membershipGroups[category];
          html += `
            <tr>
              <td>${category}</td>
              <td>${fee}</td>
            </tr>
          `;
        });
        html += `</tbody></table></div>`;
      }
    });
    // console.log(html)
    $(targetId).html(html);
  }

  $("#membership").change(function () {
    const selected = $(this).val();
    if (selected === "New ISMMACS Member") {
      $("#membershipReceiptGroup").removeClass("d-none");
      $("#membershipReceipt").attr("required", true);
    } else {
      $("#membershipReceiptGroup").addClass("d-none");
      $("#membershipReceipt").removeAttr("required");
    }
  });

  $("#nationality").change(function () {
    const nationality = $(this).val();

    if (nationality === "Foreign Participants") {
      $("#currencyGroup").removeClass("d-none");
    } else {
      $("#currencyGroup").addClass("d-none");
      $("#foreignTxnIdGroup").addClass("d-none");
      $("#foreignPaymentProofGroup").addClass("d-none");
    }

    if ($(this).val() === "Indian Participants") {
      $("#membership").prop("disabled", false);
    } else {
      $("#membership").val("");
      $("#membership").prop("disabled", true);
    }
    $("#feeAmount").text("");
  });

  $("#currency").on("change", function () {
    const currency = $(this).val();
    if (currency === "INR") {
      $("#foreignTxnIdGroup").addClass("d-none");
      $("#foreignPaymentProofGroup").addClass("d-none");
    } else {
      $("#foreignTxnIdGroup").removeClass("d-none");
      $("#foreignPaymentProofGroup").removeClass("d-none");
    }
  });

  $("#programType, #membership, #category").change(function () {
    updateFeeDisplay();
  });

  function updateFeeDisplay() {
    const nationality = $("#nationality").val();
    const membership = $("#membership").val();
    const category = $("#category").val();
    const programType = $("#programType").val();

    if (!nationality || !category || !programType) {
      $("#feeAmount").text("");
      return;
    }

    const fee = getFeeAmount(nationality, membership, category, programType);
    if (fee) {
      $("#feeAmount").text(`Fee: Rs. ${fee}`);
    } else {
      $("#feeAmount").text("Please select valid options.");
    }
  }

  function getFeeAmount(nationality, membership, category, programType) {
    const feeKey =
      programType === "Conference and Workshop"
        ? "Conference and Workshop"
        : "Conference";
    const nationalityData = feeData[feeKey][nationality];

    if (nationality === "Indian Participants") {
      // Treat "New ISMMACS Member" same as "ISMMACS Member"
      let effectiveMembership = membership;
      if (membership === "New ISMMACS Member") {
        effectiveMembership = "ISMMACS Member";
      }

      if (!effectiveMembership || !nationalityData[effectiveMembership])
        return null;

      let amount = nationalityData[effectiveMembership][category];
      return cleanAmount(amount);
    } else {
      let amount = nationalityData[category];
      return cleanAmount(amount);
    }
  }

  function cleanAmount(amount) {
    if (amount.includes("/")) {
      amount = amount.split("/")[1].trim();
    }
    amount = amount.replace("Rs ", "").replace(",", "").trim();
    return amount;
  }

  $("#proceedToPay").click(function () {
    const nationality = $("#nationality").val();
    const programType = $("#programType").val();
    const membership = $("#membership").val();
    const category = $("#category").val();
    const currency = $("#currency").val();
    const firstName = $("#firstName").val().trim();
    const lastName = $("#lastName").val().trim();
    const email = $("#email").val().trim();
    const phone = $("#phone").val().trim();
    const institute = $("#institute").val().trim();
    const txnId = $("#foreignTxnId").val().trim();
    const paymentProof = $("#foreignPaymentProof")[0]?.files[0];

    // Basic validation
    if (
      !nationality ||
      !programType ||
      !category ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !institute
    ) {
      showCustomDialog("Validation Error", "Please fill all required fields.");
      return;
    }

    // Membership for Indian
    if (nationality === "Indian Participants" && !membership) {
      showCustomDialog("Validation Error", "Please select Membership Type.");
      return;
    }

    // Membership receipt check
    if (membership === "New ISMMACS Member") {
      const membershipFile = $("#membershipReceipt")[0].files[0];
      if (!membershipFile) {
        showCustomDialog(
          "Validation Error",
          "Please upload your ISMMACS membership receipt."
        );
        return;
      }
    }

    // Currency-based validation for Foreign Participants
    if (nationality === "Foreign Participants") {
      if (!currency) {
        showCustomDialog("Validation Error", "Please select payment currency.");
        return;
      }

      if (currency !== "INR") {
        if (!txnId) {
          showCustomDialog("Validation Error", "Please enter Transaction ID.");
          return;
        }

        if (!paymentProof) {
          showCustomDialog(
            "Validation Error",
            "Please upload payment screenshot."
          );
          return;
        }
      }
    }

    const amount = getFeeAmount(nationality, membership, category, programType);
    if (!amount) {
      showCustomDialog(
        "Error",
        "Could not determine fee. Please check your selections."
      );
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("nationality", nationality);
    formData.append("programType", programType);
    formData.append(
      "membershipType",
      nationality === "Indian Participants" ? membership : ""
    );
    formData.append("category", category);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("institute", institute);
    formData.append("amount", amount);
    formData.append("membership", membership);

    // Optional fields
    if (membership === "New ISMMACS Member") {
      formData.append("membershipReceipt", $("#membershipReceipt")[0].files[0]);
    }

    if (nationality === "Foreign Participants") {
      formData.append("currency", currency);
      if (currency !== "INR") {
        formData.append("foreignTxnId", txnId);
        formData.append("foreignPaymentProof", paymentProof);
      }
    }

    if (
      (nationality === "Foreign Participants" && currency == "INR") ||
      nationality === "Indian Participants"
    ) {
      // AJAX Submit
      $.ajax({
        url: "/api/payment/payment",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          if (response.paymentLink) {
            window.location.href = response.paymentLink;
          } else {
            showCustomDialog(
              "Info",
              "Registration saved, but payment link not returned."
            );
          }
        },
        error: function (xhr) {
          console.error(xhr);
          showCustomDialog("Error", "Failed to register. Please try again.");
        },
      });
    } else {
      // AJAX Submit
      $.ajax({
        url: "/api/payment/register",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          
            window.location.href = "./registeredSuccessfully.html"
          
        },
        error: function (xhr) {
          console.error(xhr);
          showCustomDialog("Error", "Failed to register. Please try again.");
        },
      });

    }
  });

  $(".toggle-btn").click(function () {
    const target = $(this).data("target");
    $(target).toggleClass("hidden");
  });

  //   --------------------------------------------------- Sponsors Data Fetch -------------------------------------------------------------

  $.getJSON("./data/sponsors_data.json", function (response) {
    const sponsors = response.data;
    const container = $("#sponsors-container");

    sponsors.forEach((sponsor) => {
      const sponsorCard = `
          <div class="col-md-4 col-sm-6 text-center mb-4">
            <a href="${sponsor.link}" target="_blank" class="sponsor-card d-block p-3">
              <img src="${sponsor.image}" alt="Sponsor Logo" class="sponsor-img img-fluid">
            </a>
          </div>`;
      container.append(sponsorCard);
    });
  });

  // ------------------------------------------------------------------ Call for Abstract Page --------------------------------------------------------------------------------

  $.getJSON("./data/call_for_abstract.json", function (data) {
    const content = `
    <div class="call-abstract-section">
      <h2 class="call-abstract-title">${data.title}</h2>
      <p class="call-abstract-description">${data.description}</p>

      <h4 class="call-abstract-guidelines-title">Topics include (but not limited to):</h4>
      <ul class="call-abstract-topics">
        ${data.topics.map((topic) => `<li>${topic}</li>`).join("")}
      </ul>

      <h4 class="call-abstract-guidelines-title">${data.guidelinesTitle}</h4>
      <ul class="call-abstract-guidelines">
        ${data.guidelines.map((item) => `<li>${item}</li>`).join("")}
      </ul>

      <p class="call-abstract-closing">${data.closingNote}</p>
    </div>
  `;
    $("#call-for-abstract-container").html(content);
  });

  // ---------------------------------------------------- Call for Abstract Form ---------------------------------------------------------------------------------

  // $("input[name='uploadType']").change(function () {
  //   if (this.value === "text") {
  //     $("#textContentDiv").removeClass("d-none");
  //     $("#pdfContentDiv").addClass("d-none");
  //     $("#abstractFile").val("");
  //   } else if (this.value === "pdf") {
  //     $("#pdfContentDiv").removeClass("d-none");
  //     $("#textContentDiv").addClass("d-none");
  //     $("#abstractContent").val("");
  //   }
  // });

  // $("#previewBtn").click(function () {
  //   const fullName = $("#fullName").val().trim();
  //   const title = $("#title").val();
  //   const position = $("#position").val();
  //   const affiliation = $("#affiliation").val().trim();
  //   const abstractTitle = $("#abstractTitle").val().trim();
  //   const coauthors = $("#coauthors").val().trim();
  //   const uploadType = $("input[name='uploadType']:checked").val();
  //   const content = $("#abstractContent").val().trim();
  //   const file = $("#abstractFile")[0].files[0];

  //   // Validation
  //   if (
  //     !fullName ||
  //     !title ||
  //     !position ||
  //     !affiliation ||
  //     !abstractTitle ||
  //     !uploadType
  //   ) {
  //     showCustomAlert("Please fill all required fields.", "danger");
  //     return;
  //   }

  //   if (uploadType === "text" && !content) {
  //     showCustomAlert("Please provide abstract content text.", "danger");
  //     return;
  //   }
  //   if (uploadType === "pdf" && !file) {
  //     showCustomAlert("Please upload a PDF file.", "danger");
  //     return;
  //   }

  //   let previewHtml = `
  //     <p><strong>Full Name:</strong> ${fullName}</p>
  //     <p><strong>Title:</strong> ${title}</p>
  //     <p><strong>Position:</strong> ${position}</p>
  //     <p><strong>Affiliation:</strong> ${affiliation}</p>
  //     <p><strong>Abstract Title:</strong> ${abstractTitle}</p>
  //     <p><strong>Co-authors:</strong> ${coauthors || "N/A"}</p>
  //   `;

  //   if (uploadType === "text") {
  //     previewHtml += `<p><strong>Abstract Content:</strong><br>${content}</p>`;
  //   } else if (uploadType === "pdf") {
  //     previewHtml += `<p><strong>PDF File:</strong> ${file.name}</p>`;
  //   }

  //   $("#previewContent").html(previewHtml);
  //   $("#previewModal").modal("show");
  // });

  // $("#confirmSubmit").click(function () {
  //   $("#previewModal").modal("hide");
  //   showCustomAlert(
  //     "Your abstract has been successfully submitted!",
  //     "success"
  //   );
  //   $("#abstractForm")[0].reset();
  //   $("#textContentDiv, #pdfContentDiv").addClass("d-none");
  // });

  // function showCustomAlert(message, type = "success") {
  //   $("#customAlert")
  //     .removeClass("d-none alert-success alert-danger alert-warning")
  //     .addClass("alert-" + type)
  //     .html(message);
  //   setTimeout(() => {
  //     $("#customAlert").addClass("d-none");
  //   }, 4000);
  // }

  // Add co-author
  $("#addCoauthor").click(function () {
    const newField = `
    <div class="input-group mb-2">
      <input type="text" name="coauthorNames[]" class="form-control" placeholder="Co-author name" />
      <input type="text" name="coauthorAffiliations[]" class="form-control" placeholder="Affiliation" />
      <button type="button" class="btn btn-danger remove-coauthor">Remove</button>
    </div>
  `;
    $("#coauthorsList").append(newField);
  });

  // Remove co-author
  $(document).on("click", ".remove-coauthor", function () {
    $(this).closest(".input-group").remove();
  });

  $("#previewBtn").click(function () {
    const fullName = $("#fullName").val().trim();
    const title = $("#title").val();
    const position = $("#position").val();
    const affiliation = $("#affiliation").val().trim();
    const abstractTitle = $("#abstractTitle").val().trim();
    const file = $("#abstractFile")[0].files[0];

    let coauthors = [];
    $("input[name='coauthorNames[]']").each(function (index) {
      const name = $(this).val().trim();
      const aff = $("input[name='coauthorAffiliations[]']")
        .eq(index)
        .val()
        .trim();
      if (name !== "" || aff !== "") {
        coauthors.push(`${name} (${aff})`);
      }
    });

    if (
      !fullName ||
      !title ||
      !position ||
      !affiliation ||
      !abstractTitle ||
      !file
    ) {
      showCustomAlert(
        "Please fill all required fields and upload the PDF.",
        "danger"
      );
      return;
    }

    let previewHtml = `
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Title:</strong> ${title}</p>
    <p><strong>Position:</strong> ${position}</p>
    <p><strong>Affiliation:</strong> ${affiliation}</p>
    <p><strong>Abstract Title:</strong> ${abstractTitle}</p>
    <p><strong>Co-authors:</strong> ${
      coauthors.length > 0 ? coauthors.join(", ") : "None"
    }</p>
    <p><strong>PDF File:</strong> ${file.name}</p>
  `;

    $("#previewContent").html(previewHtml);
    $("#previewModal").modal("show");
  });

  $("#confirmSubmit").click(function () {
    const formData = new FormData();
    formData.append("fullName", $("#fullName").val().trim());
    formData.append("title", $("#title").val());
    formData.append("position", $("#position").val());
    formData.append("affiliation", $("#affiliation").val().trim());
    formData.append("abstractTitle", $("#abstractTitle").val().trim());

    $("input[name='coauthorNames[]']").each(function (index) {
      const name = $(this).val().trim();
      const aff = $("input[name='coauthorAffiliations[]']")
        .eq(index)
        .val()
        .trim();
      if (name !== "" || aff !== "") {
        formData.append(
          "coauthors[]",
          JSON.stringify({ name, affiliation: aff })
        );
      }
    });

    const file = $("#abstractFile")[0].files[0];
    if (file) {
      formData.append("abstractFile", file);
    }

    $.ajax({
      url: "/api/abstract/submit",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        $("#previewModal").modal("hide");
        showCustomAlert(
          "Your abstract has been successfully submitted!",
          "success"
        );
        $("#abstractForm")[0].reset();
        $("#coauthorsList").html(`
        <div class="input-group mb-2">
          <input type="text" name="coauthorNames[]" class="form-control" placeholder="Co-author name" />
          <input type="text" name="coauthorAffiliations[]" class="form-control" placeholder="Affiliation" />
          <button type="button" class="btn btn-danger remove-coauthor d-none">Remove</button>
        </div>
      `);
      },
      error: function (xhr) {
        $("#previewModal").modal("hide");
        showCustomAlert("Submission failed. Please try again.", "danger");
      },
    });
  });

  function showCustomAlert(message, type = "success") {
    $("#customAlert")
      .removeClass("d-none alert-success alert-danger alert-warning")
      .addClass("alert-" + type)
      .html(message);
    setTimeout(() => {
      $("#customAlert").addClass("d-none");
    }, 4000);
  }

  // ------------------------------------------------------------------------------------- Call for Symposium ----------------------------------------------

  $.getJSON("./data/call_for_symposium.json", function (data) {
    let html = `
    <h2 class="symposium-title mb-3">${data.title}</h2>
    <p class="symposium-intro mb-4">${data.intro}</p>
    <h5 class="symposium-subtitle mb-2">The proposal should include the following information:</h5>
    <ul class="symposium-list">
  `;

    data.requirements.forEach((req) => {
      html += `<li><strong>${req.label}:</strong> ${req.description}</li>`;
    });

    html += `</ul><p class="symposium-note mt-3"><strong>Note:</strong> ${data.note}</p>`;

    $("#call-symposium-section").html(html);
  });

  // ----------------------------------------------------------- Vibrant Campus --------------------------------------------------------------------------------

  $.getJSON("./data/vibrant_campus.json", function (data) {
    let galleryHTML = `<div class="vibrant-gallery">`;

    data.photos.forEach((photo) => {
      galleryHTML += `
      <div class="vibrant-gallery-item">
        <img loading="lazy" src="${photo.image}" alt="Campus Image">
      </div>
    `;
    });

    galleryHTML += `</div>`;
    $("#vibrant-campus").html(`
    <h2 class="text-center mb-4">Vibrant Campus</h2>
    ${galleryHTML}
  `);
  });
});

function toggleMore(button, index) {
  $(`.hidden-${index}`).removeClass("hidden-interest");
  $(button).hide();
}

function showCustomDialog(title, message) {
  $("#customAlertTitle").text(title);
  $("#customAlertBody").html(message);
  const modal = new bootstrap.Modal(
    document.getElementById("customAlertModal")
  );
  modal.show();
}
