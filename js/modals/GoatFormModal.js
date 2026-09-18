/**
 * GoatFormModal
 *
 * Register a new goat or edit an existing goat record.
 */

import { Modal } from "../components/Modal.js";
import { GOAT_BREEDS, getNextSuggestedGoatId } from "../goatMeta.js";


export function GoatFormModal({
    initial = null,
    existingGoats = [],
    onClose,
    onSave,
    isEdit = false
}) {

    const form = {
        ...(initial || {
            id: "",
            name: "",
            sex: "female",
            breed: "",
            dob: "",
            source: "purchased",
            purchaseDate: "",
            purchasePrice: "",
            status: "active",
        })
    };


    const content =
        document.createElement("div");


    /* =====================================================
       HELPER FUNCTIONS
       ===================================================== */

    function createLabel(text) {

        const label =
            document.createElement("label");

        label.textContent = text;

        return label;
    }


    function createInput(
        type,
        value,
        placeholder = "",
        disabled = false
    ) {

        const input =
            document.createElement("input");

        input.type = type;

        input.value =
            value ?? "";

        input.placeholder =
            placeholder;

        input.disabled =
            disabled;

        return input;
    }


    function createSelect(options, value) {

        const select =
            document.createElement("select");

        options.forEach((option) => {

            const element =
                document.createElement("option");

            element.value =
                option.value;

            element.textContent =
                option.label;

            if (option.value === value) {
                element.selected = true;
            }

            select.appendChild(element);
        });

        return select;
    }


    /* =====================================================
       FORM ELEMENTS
       ===================================================== */

    const suggestedId = !isEdit
        ? getNextSuggestedGoatId(
            existingGoats.map((goat) => goat.id)
        )
        : form.id;

    const idInput = createInput(
        "text",
        suggestedId,
        "e.g. GF-007",
        isEdit
    );

    idInput.required = true;


    const nameInput = createInput(
        "text",
        form.name,
        "e.g. Kaali, Bhoora"
    );


    const sexSelect = createSelect(
        [
            {
                value: "female",
                label: "Female (Doe)"
            },
            {
                value: "male",
                label: "Male (Buck)"
            }
        ],
        form.sex
    );


    const breedOptions = [
        {
            value: "",
            label: "Select breed"
        },
        ...GOAT_BREEDS.map((breed) => ({
            value: breed,
            label: breed
        }))
    ];

    if (form.breed && !GOAT_BREEDS.includes(form.breed)) {
        breedOptions.push({
            value: form.breed,
            label: `${form.breed} (custom)`
        });
    }

    const breedInput = createSelect(
        breedOptions,
        form.breed || ""
    );


    const dobInput = createInput(
        "date",
        form.dob
    );

    dobInput.required = true;


    const statusSelect = createSelect(
        [
            {
                value: "active",
                label: "Active"
            },
            {
                value: "pregnant",
                label: "Pregnant"
            },
            {
                value: "kid",
                label: "Kid"
            },
            {
                value: "sold",
                label: "Sold"
            },
            {
                value: "deceased",
                label: "Deceased"
            }
        ],
        form.status
    );


    const sourceSelect = createSelect(
        [
            {
                value: "purchased",
                label: "Purchased"
            },
            {
                value: "born_on_farm",
                label: "Born on farm"
            }
        ],
        form.source
    );


    const purchaseDateInput =
        createInput(
            "date",
            form.purchaseDate
        );


    const purchasePriceInput =
        createInput(
            "number",
            form.purchasePrice,
            "8500"
        );


    /* =====================================================
       BUILD FORM
       ===================================================== */

    const idLabel =
        createLabel(
            "Tag ID (Unique Ear Tag)"
        );

    idLabel.appendChild(idInput);


    const nameLabel =
        createLabel(
            "Name (optional)"
        );

    nameLabel.appendChild(nameInput);


    const sexLabel =
        createLabel("Sex");

    sexLabel.appendChild(sexSelect);


    const breedLabel =
        createLabel("Breed");

    breedLabel.appendChild(breedInput);


    const dobLabel =
        createLabel("Date of Birth");

    dobLabel.appendChild(dobInput);


    const statusLabel =
        createLabel("Status");

    statusLabel.appendChild(statusSelect);


    const sourceLabel =
        createLabel("Acquisition Source");

    sourceLabel.appendChild(sourceSelect);


    const purchaseDateLabel =
        createLabel("Purchase Date");

    purchaseDateLabel.appendChild(
        purchaseDateInput
    );


    const purchasePriceLabel =
        createLabel(
            "Purchase Price (₹)"
        );

    purchasePriceLabel.appendChild(
        purchasePriceInput
    );


    content.appendChild(idLabel);
    content.appendChild(nameLabel);


    const row1 =
        document.createElement("div");

    row1.className =
        "row-2";

    row1.appendChild(sexLabel);
    row1.appendChild(breedLabel);

    content.appendChild(row1);


    const row2 =
        document.createElement("div");

    row2.className =
        "row-2";

    row2.appendChild(dobLabel);
    row2.appendChild(statusLabel);

    content.appendChild(row2);


    content.appendChild(sourceLabel);


    /* =====================================================
       PURCHASE SECTION
       ===================================================== */

    const purchaseRow =
        document.createElement("div");

    purchaseRow.className =
        "row-2";

    purchaseRow.appendChild(
        purchaseDateLabel
    );

    purchaseRow.appendChild(
        purchasePriceLabel
    );


    function updatePurchaseVisibility() {

        if (sourceSelect.value === "purchased") {

            if (!purchaseRow.parentNode) {
                content.appendChild(
                    purchaseRow
                );
            }

        } else {

            if (purchaseRow.parentNode) {
                purchaseRow.remove();
            }
        }
    }


    sourceSelect.addEventListener(
        "change",
        updatePurchaseVisibility
    );

    updatePurchaseVisibility();


    /* =====================================================
       SAVE
       ===================================================== */

    function handleSubmit() {

        const id =
            idInput.value.trim();

        const dob =
            dobInput.value;


        if (!id || !dob) {
            return;
        }


        const updatedGoat = {

            ...form,

            id,

            name:
                nameInput.value,

            sex:
                sexSelect.value,

            breed:
                breedInput.value,

            dob,

            status:
                statusSelect.value,

            source:
                sourceSelect.value,

            purchaseDate:
                purchaseDateInput.value,

            purchasePrice:
                Number(
                    purchasePriceInput.value
                ) || 0,

            weights:
                initial?.weights || [],

            health:
                initial?.health || [],

            feeding:
                initial?.feeding || [],

            breeding:
                initial?.breeding || []
        };


        if (typeof onSave === "function") {
            onSave(updatedGoat);
        }

        if (typeof onClose === "function") {
            onClose();
        }
    }


    /* =====================================================
       FOOTER
       ===================================================== */

    const footer =
        document.createElement("div");


    const cancelButton =
        document.createElement("button");

    cancelButton.className =
        "btn-ghost";

    cancelButton.textContent =
        "Cancel";

    cancelButton.addEventListener(
        "click",
        onClose
    );


    const saveButton =
        document.createElement("button");

    saveButton.className =
        "btn-primary";

    saveButton.textContent =
        isEdit
            ? "Save changes"
            : "Add goat";

    saveButton.addEventListener(
        "click",
        handleSubmit
    );


    footer.appendChild(
        cancelButton
    );

    footer.appendChild(
        saveButton
    );


    /* =====================================================
       RETURN MODAL
       ===================================================== */

    return Modal({

        title: isEdit
            ? `Edit goat record (${form.id})`
            : "Register a new goat",

        onClose,

        children: content,

        footer
    });
}
