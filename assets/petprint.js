document.addEventListener('DOMContentLoaded', () => {
  initPetPrintConfigurator();
});


/**
 * =========================================================
 * PETPRINT CONFIGURATOR
 * =========================================================
 *
 * Handles:
 *
 * 1. T-shirt type
 * 2. T-shirt color
 * 3. Artwork position
 * 4. Pet photo upload
 * 5. Pet photo removal
 * 6. Live preview
 * 7. Step navigation
 *
 * =========================================================
 */


/**
 * Initialize all PetPrint configurators on the page.
 */
function initPetPrintConfigurator() {

  const configurators = document.querySelectorAll(
    '[data-petprint-configurator]'
  );


  if (!configurators.length) {
    return;
  }


  configurators.forEach((configurator) => {

    /**
     * =====================================================
     * CONFIGURATOR STATE
     * =====================================================
     */

    const state = {

      tshirtType: 'half-sleeve',

      color: 'black',

      position: 'center',

      photo: null,

      photoUrl: null,

      style: 'original'

    };


    /**
     * =====================================================
     * T-SHIRT OPTIONS
     * =====================================================
     */

    const tshirtOptions = configurator.querySelectorAll(
      '[data-tshirt-type]'
    );


    /**
     * =====================================================
     * LIVE PREVIEW
     * =====================================================
     */

    const tshirtPreview = configurator.querySelector(
      '[data-preview-tshirt]'
    );


    /**
     * =====================================================
     * COLOR OPTIONS
     * =====================================================
     */

    const colorOptions = configurator.querySelectorAll(
      '[data-tshirt-color]'
    );


    /**
     * =====================================================
     * POSITION OPTIONS
     * =====================================================
     */

    const positionOptions = configurator.querySelectorAll(
      '[data-art-position]'
    );


    /**
     * =====================================================
     * PET PHOTO ELEMENTS
     * =====================================================
     */

    /** @type {HTMLInputElement | null} */
    const petPhotoInput = configurator.querySelector(
    '[data-pet-photo-input]'
    );

    /** @type {HTMLElement | null} */
    const petPhotoSelected = configurator.querySelector(
    '[data-pet-photo-selected]'
    );

    /** @type {HTMLImageElement | null} */
    const petPhotoThumbnail = configurator.querySelector(
    '[data-pet-photo-thumbnail]'
    );

    /** @type {HTMLElement | null} */
    const petPhotoName = configurator.querySelector(
    '[data-pet-photo-name]'
    );

    /** @type {HTMLElement | null} */
    const petPhotoSize = configurator.querySelector(
    '[data-pet-photo-size]'
    );

    /** @type {HTMLElement | null} */
    const petPhotoError = configurator.querySelector(
    '[data-pet-photo-error]'
    );

    /** @type {HTMLImageElement | null} */
    const previewPetImage = configurator.querySelector(
    '[data-preview-pet-image]'
    );

    /** @type {HTMLElement | null} */
    const previewArtPlaceholder = configurator.querySelector(
    '[data-preview-art-placeholder]'
    );

    /** @type {HTMLButtonElement | null} */
    const petPhotoRemove = configurator.querySelector(
    '[data-pet-photo-remove]'
    );


    /**
     * =====================================================
     * STEP NAVIGATION
     * =====================================================
     */

    const nextButtons = configurator.querySelectorAll(
      '[data-configurator-next]'
    );


    const backButtons = configurator.querySelectorAll(
      '[data-configurator-back]'
    );


    let currentStep = 1;


    /**
     * =====================================================
     * NEXT BUTTONS
     * =====================================================
     */

    nextButtons.forEach((button) => {

      button.addEventListener('click', () => {

        if (currentStep >= 5) {
          return;
        }


        currentStep += 1;


        showConfiguratorStep(
          configurator,
          currentStep
        );

      });

    });


    /**
     * =====================================================
     * BACK BUTTONS
     * =====================================================
     */

    backButtons.forEach((button) => {

      button.addEventListener('click', () => {

        if (currentStep <= 1) {
          return;
        }


        currentStep -= 1;


        showConfiguratorStep(
          configurator,
          currentStep
        );

      });

    });


    /**
     * =====================================================
     * T-SHIRT TYPE SELECTION
     * =====================================================
     */

    tshirtOptions.forEach((option) => {

      option.addEventListener('click', () => {

        const selectedType =
          option.getAttribute('data-tshirt-type');


        if (!selectedType) {
          return;
        }


        /**
         * Update state.
         */

        state.tshirtType = selectedType;


        /**
         * Remove selected class
         * from all options.
         */

        tshirtOptions.forEach((item) => {

          item.classList.remove(
            'pp-configurator__product-option--selected'
          );

        });


        /**
         * Select current option.
         */

        option.classList.add(
          'pp-configurator__product-option--selected'
        );


        /**
         * Update preview.
         */

        updateTshirtPreview(
          tshirtPreview,
          state
        );

      });

    });


    /**
     * =====================================================
     * T-SHIRT COLOR SELECTION
     * =====================================================
     */

    colorOptions.forEach((option) => {

      option.addEventListener('click', () => {

        const selectedColor =
          option.getAttribute('data-tshirt-color');


        if (!selectedColor) {
          return;
        }


        /**
         * Update state.
         */

        state.color = selectedColor;


        /**
         * Remove selected class
         * from all colors.
         */

        colorOptions.forEach((item) => {

          item.classList.remove(
            'pp-configurator__color-option--selected'
          );

        });


        /**
         * Select current color.
         */

        option.classList.add(
          'pp-configurator__color-option--selected'
        );


        /**
         * Update preview.
         */

        updateTshirtPreview(
          tshirtPreview,
          state
        );

      });

    });


    /**
     * =====================================================
     * ARTWORK POSITION SELECTION
     * =====================================================
     */

    positionOptions.forEach((option) => {

      option.addEventListener('click', () => {

        const selectedPosition =
          option.getAttribute('data-art-position');


        if (!selectedPosition) {
          return;
        }


        /**
         * Update state.
         */

        state.position = selectedPosition;


        /**
         * Remove selected class
         * from all positions.
         */

        positionOptions.forEach((item) => {

          item.classList.remove(
            'pp-configurator__position-option--selected'
          );

        });


        /**
         * Select current position.
         */

        option.classList.add(
          'pp-configurator__position-option--selected'
        );


        /**
         * Update preview.
         */

        updateTshirtPreview(
          tshirtPreview,
          state
        );

      });

    });


    /**
     * =====================================================
     * PET PHOTO UPLOAD
     * =====================================================
     */

    if (petPhotoInput) {

      petPhotoInput.addEventListener(
        'change',
        (event) => {

          const input = event.currentTarget;


          /**
           * TypeScript / VS Code safety.
           */

          if (!(input instanceof HTMLInputElement)) {
            return;
          }


          const file = input.files?.[0];


          if (!file) {
            return;
          }


          handlePetPhotoUpload(
            file,
            state,
            {
              petPhotoSelected,
              petPhotoThumbnail,
              petPhotoName,
              petPhotoSize,
              petPhotoError,
              previewPetImage,
              previewArtPlaceholder
            }
          );

        }
      );

    }


    /**
     * =====================================================
     * REMOVE PET PHOTO
     * =====================================================
     */

    if (petPhotoRemove) {

      petPhotoRemove.addEventListener(
        'click',
        () => {

          removePetPhoto(
            state,
            {
              petPhotoInput,
              petPhotoSelected,
              petPhotoThumbnail,
              petPhotoName,
              petPhotoSize,
              petPhotoError,
              previewPetImage,
              previewArtPlaceholder
            }
          );

        }
      );

    }


    /**
     * =====================================================
     * INITIAL PREVIEW
     * =====================================================
     */

    updateTshirtPreview(
      tshirtPreview,
      state
    );


    /**
     * =====================================================
     * INITIAL STEP
     * =====================================================
     */

    showConfiguratorStep(
      configurator,
      currentStep
    );

  });

}


/**
 * =========================================================
 * UPDATE T-SHIRT PREVIEW
 * =========================================================
 *
 * @param {Element | null} preview
 * @param {{
 *   tshirtType: string,
 *   color: string,
 *   position: string,
 *   photo: File | null,
 *   photoUrl: string | null,
 *   style: string
 * }} state
 */
function updateTshirtPreview(
  preview,
  state
) {

  if (!preview) {
    return;
  }


  /**
   * =======================================================
   * REMOVE PREVIOUS SLEEVE CLASSES
   * =======================================================
   */

  preview.classList.remove(
    'pp-tshirt--half-sleeve',
    'pp-tshirt--full-sleeve'
  );


  /**
   * =======================================================
   * APPLY SLEEVE TYPE
   * =======================================================
   */

  if (state.tshirtType === 'full-sleeve') {

    preview.classList.add(
      'pp-tshirt--full-sleeve'
    );

  } else {

    preview.classList.add(
      'pp-tshirt--half-sleeve'
    );

  }


  /**
   * =======================================================
   * REMOVE PREVIOUS COLOR CLASSES
   * =======================================================
   */

  preview.classList.remove(
    'pp-tshirt--black',
    'pp-tshirt--white',
    'pp-tshirt--navy',
    'pp-tshirt--beige',
    'pp-tshirt--pink'
  );


  /**
   * =======================================================
   * APPLY COLOR
   * =======================================================
   */

  preview.classList.add(
    `pp-tshirt--${state.color}`
  );


  /**
   * =======================================================
   * REMOVE PREVIOUS POSITION CLASSES
   * =======================================================
   */

  preview.classList.remove(
    'pp-position--center',
    'pp-position--left-chest',
    'pp-position--right-chest',
    'pp-position--back'
  );


  /**
   * =======================================================
   * APPLY POSITION
   * =======================================================
   */

  preview.classList.add(
    `pp-position--${state.position}`
  );

}


/**
 * =========================================================
 * SHOW CONFIGURATOR STEP
 * =========================================================
 *
 * @param {Element} configurator
 * @param {number} stepNumber
 */
function showConfiguratorStep(
  configurator,
  stepNumber
) {

  /**
   * Find all step content elements.
   */

  const stepContents =
    configurator.querySelectorAll(
      '[data-configurator-step]'
    );


  /**
   * Find progress steps.
   */

  const progressSteps =
    configurator.querySelectorAll(
      '.pp-configurator__step'
    );


  /**
   * =======================================================
   * HIDE ALL STEPS
   * =======================================================
   */

  stepContents.forEach((step) => {

    step.classList.remove(
      'pp-configurator__step-content--active'
    );

  });


  /**
   * =======================================================
   * SHOW CURRENT STEP
   * =======================================================
   */

  const currentContent =
    configurator.querySelector(
      `[data-configurator-step="${stepNumber}"]`
    );


  if (currentContent) {

    currentContent.classList.add(
      'pp-configurator__step-content--active'
    );

  }


  /**
   * =======================================================
   * UPDATE PROGRESS INDICATOR
   * =======================================================
   */

  progressSteps.forEach((step, index) => {

    step.classList.remove(
      'pp-configurator__step--active'
    );


    if (index + 1 === stepNumber) {

      step.classList.add(
        'pp-configurator__step--active'
      );

    }

  });

}

/**
 * @typedef {Object} PetPrintState
 * @property {string} tshirtType
 * @property {string} color
 * @property {string} position
 * @property {File | null} photo
 * @property {string | null} photoUrl
 * @property {string} style
 */

/**
 * =========================================================
 * HANDLE PET PHOTO UPLOAD
 * =========================================================
 * @param {File} file
 * @param {PetPrintState} state
 * @param {{
 *   petPhotoSelected: HTMLElement | null,
 *   petPhotoThumbnail: HTMLImageElement | null,
 *   petPhotoName: HTMLElement | null,
 *   petPhotoSize: HTMLElement | null,
 *   petPhotoError: HTMLElement | null,
 *   previewPetImage: HTMLImageElement | null,
 *   previewArtPlaceholder: HTMLElement | null
 * }} elements
 */
function handlePetPhotoUpload(
  file,
  state,
  elements
) {

  const {
    petPhotoSelected,
    petPhotoThumbnail,
    petPhotoName,
    petPhotoSize,
    petPhotoError,
    previewPetImage,
    previewArtPlaceholder
  } = elements;


  /**
   * =======================================================
   * CLEAR PREVIOUS ERROR
   * =======================================================
   */

  if (petPhotoError) {

    petPhotoError.hidden = true;

    petPhotoError.textContent = '';

  }


  /**
   * =======================================================
   * ALLOWED FILE TYPES
   * =======================================================
   */

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];


  if (!allowedTypes.includes(file.type)) {

    showPetPhotoError(
      petPhotoError,
      'Please upload a JPG, PNG or WEBP image.'
    );

    return;

  }


  /**
   * =======================================================
   * MAXIMUM FILE SIZE
   * =======================================================
   *
   * 10 MB
   */

  const maxSize =
    10 * 1024 * 1024;


  if (file.size > maxSize) {

    showPetPhotoError(
      petPhotoError,
      'Your image must be smaller than 10MB.'
    );

    return;

  }


  /**
   * =======================================================
   * REVOKE PREVIOUS IMAGE URL
   * =======================================================
   */

  if (state.photoUrl) {

    URL.revokeObjectURL(
      state.photoUrl
    );

  }


  /**
   * =======================================================
   * SAVE FILE TO STATE
   * =======================================================
   */

  state.photo = file;


  /**
   * =======================================================
   * CREATE BROWSER IMAGE URL
   * =======================================================
   */

  const imageUrl =
    URL.createObjectURL(file);


  state.photoUrl = imageUrl;


  /**
   * =======================================================
   * UPDATE THUMBNAIL
   * =======================================================
   */

  if (petPhotoThumbnail) {

    petPhotoThumbnail.src =
      imageUrl;

  }


  /**
   * =======================================================
   * UPDATE FILE NAME
   * =======================================================
   */

  if (petPhotoName) {

    petPhotoName.textContent =
      file.name;

  }


  /**
   * =======================================================
   * UPDATE FILE SIZE
   * =======================================================
   */

  if (petPhotoSize) {

    petPhotoSize.textContent =
      formatFileSize(file.size);

  }


  /**
   * =======================================================
   * SHOW SELECTED FILE
   * =======================================================
   */

  if (petPhotoSelected) {

    petPhotoSelected.hidden = false;

  }


  /**
   * =======================================================
   * UPDATE LIVE PREVIEW
   * =======================================================
   */

  if (previewPetImage) {

    previewPetImage.src =
      imageUrl;

    previewPetImage.hidden =
      false;

  }


  /**
   * =======================================================
   * HIDE PLACEHOLDER
   * =======================================================
   */

  if (previewArtPlaceholder) {

    previewArtPlaceholder.hidden =
      true;

  }

}


/**
 * =========================================================
 * SHOW PET PHOTO ERROR
 * =========================================================
 *
 * @param {HTMLElement | null} errorElement
 * @param {string} message
 */
function showPetPhotoError(
  errorElement,
  message
) {

  if (!errorElement) {
    return;
  }


  errorElement.textContent =
    message;


  errorElement.hidden =
    false;

}


/**
 * =========================================================
 * FORMAT FILE SIZE
 * =========================================================
 *
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {

  if (bytes === 0) {
    return '0 Bytes';
  }


  const units = [
    'Bytes',
    'KB',
    'MB',
    'GB'
  ];


  const index =
    Math.floor(
      Math.log(bytes) /
      Math.log(1024)
    );


  const size =
    bytes /
    Math.pow(1024, index);


  return `${size.toFixed(1)} ${units[index]}`;

}


/**
 * =========================================================
 * REMOVE PET PHOTO
 * =========================================================
 *
 * @param {PetPrintState} state
 * @param {{
 *   petPhotoInput: HTMLInputElement | null,
 *   petPhotoSelected: HTMLElement | null,
 *   petPhotoThumbnail: HTMLImageElement | null,
 *   petPhotoName: HTMLElement | null,
 *   petPhotoSize: HTMLElement | null,
 *   petPhotoError: HTMLElement | null,
 *   previewPetImage: HTMLImageElement | null,
 *   previewArtPlaceholder: HTMLElement | null
 * }} elements
 */
function removePetPhoto(
  state,
  elements
) {

  const {
    petPhotoInput,
    petPhotoSelected,
    petPhotoThumbnail,
    petPhotoName,
    petPhotoSize,
    petPhotoError,
    previewPetImage,
    previewArtPlaceholder
  } = elements;


  /**
   * =======================================================
   * CLEAR STATE
   * =======================================================
   */

  state.photo = null;


  /**
   * =======================================================
   * REVOKE IMAGE URL
   * =======================================================
   */

  if (state.photoUrl) {

    URL.revokeObjectURL(
      state.photoUrl
    );

    state.photoUrl = null;

  }


  /**
   * =======================================================
   * RESET FILE INPUT
   * =======================================================
   */

  if (petPhotoInput) {

    petPhotoInput.value = '';

  }


  /**
   * =======================================================
   * HIDE SELECTED FILE
   * =======================================================
   */

  if (petPhotoSelected) {

    petPhotoSelected.hidden =
      true;

  }


  /**
   * =======================================================
   * RESET THUMBNAIL
   * =======================================================
   */

  if (petPhotoThumbnail) {

    petPhotoThumbnail.src = '';

  }


  /**
   * =======================================================
   * RESET FILE NAME
   * =======================================================
   */

  if (petPhotoName) {

    petPhotoName.textContent =
      'Pet photo';

  }


  /**
   * =======================================================
   * RESET FILE SIZE
   * =======================================================
   */

  if (petPhotoSize) {

    petPhotoSize.textContent =
      '0 KB';

  }


  /**
   * =======================================================
   * CLEAR ERROR
   * =======================================================
   */

  if (petPhotoError) {

    petPhotoError.hidden =
      true;

    petPhotoError.textContent =
      '';

  }


  /**
   * =======================================================
   * HIDE PREVIEW IMAGE
   * =======================================================
   */

  if (previewPetImage) {

    previewPetImage.src =
      '';

    previewPetImage.hidden =
      true;

  }


  /**
   * =======================================================
   * SHOW PLACEHOLDER
   * =======================================================
   */

  if (previewArtPlaceholder) {

    previewArtPlaceholder.hidden =
      false;

  }

}