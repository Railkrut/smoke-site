$(document).ready(function () {
    new WOW().init();

    $('.atmosphere-video-items').slick({
        dots: true,
    });

    $('.reviews-items').slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                }
            }
        ]
    });

    $('.blue-btn').click(function () {
        $('.menu')[0].scrollIntoView({behavior: 'smooth'});
    });

    $('.transparent-btn').click(function () {
        $('.reservation')[0].scrollIntoView({behavior: 'smooth'});
    })

    $('#listReservation').click(function () {
        $('.reservation')[0].scrollIntoView({behavior: 'smooth'});
    })

    $('#listMenu').click(function () {
        $('.menu')[0].scrollIntoView({behavior: 'smooth'});
    })

    $('#listReviews').click(function () {
        $('.reviews')[0].scrollIntoView({behavior: 'smooth'});
    })

    $('#burger').on('click', function () {
        $('#menu').css('display', 'flex');
        $('body').css('overflow', 'hidden');
        $('#menuClose').show()
    })

    $("#menu *").each(function (item) {
        $(this).on('click', function (e) {
            $('#menu').css('display', 'none');
            $('body').css('overflow', 'visible');
            $('#menuClose').hide()
        });
    });

    $('#popupClose').on('click', function () {
        $('#popup').removeClass('active')
        $('body').css('overflow-y', 'visible')
        $('#form').reset()
    })

    const number = $('#phone')
    const name = $("#name")
    const $select = $('.form-select').first();
    const $selectHeader = $('.select-header').first();
    const $selectCurrent = $('.select-current').first();
    const $selectIcon = $('.select-icon').first();
    const $selectItems = $('.select-item');
    const $errorMessageSelect = $('#selectError');

    if (number) {
        number.inputmask("+7 (999) 999-99-99");
        const rawPhone = number.val().replace(/\D/g, "");
    }

    if (name) {
        name[0].onkeydown = (e) => {
            if (/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        };
    }

    if (!$select.length || !$selectHeader.length || !$selectIcon.length || !$selectCurrent.length) return;

    let isSelectOpen = false;

    const toggleSelect = (open) => {
        isSelectOpen = open !== undefined ? open : !isSelectOpen;

        $select.toggleClass("is-active", isSelectOpen);
        $selectIcon.css("transform", isSelectOpen ? "rotate(180deg)" : "rotate(0)");

        if (isSelectOpen) {
            $selectHeader.css({
                "background-color": "#fff",
                "border-top-right-radius": "5px",
                "border-top-left-radius": "5px"
            });
            $selectCurrent.css("color", "#141c2c");
            $select.css("border", "none");
        } else {
            $selectHeader.css({
                "background-color": "transparent",
                "border-top-right-radius": "0",
                "border-top-left-radius": "0"
            });
            $selectCurrent.css("color", "#fff");
            $select.css("border", "1px solid rgb(255, 255, 255)");
        }
    };

    $selectHeader.on("click", function (e) {
        e.stopPropagation();
        toggleSelect();
    });

    $selectItems.each(function () {
        $(this).on("click", function (e) {
            $selectItems.removeClass("is-chosen")
            e.stopPropagation();

            $selectCurrent.text($(this).text());
            $errorMessageSelect.hide();
            $select.css('borderColor', '#ffffff');
            if ($selectCurrent.text().trim() === $(this).text().trim()) {
                $(this).toggleClass("is-chosen")
            }
            toggleSelect(false);
        });

        if ($selectCurrent.text().trim() === $(this).text().trim()) {
            $(this).css("color", "#003bfb");
        }
    });

// Закрытие при клике вне селекта
    $(document).on("click", function (e) {
        if (!$select.is(e.target) && $select.has(e.target).length === 0) {
            toggleSelect(false);
        }
    });

// Обработка клавиатуры
    $(document).on("keydown", function (e) {
        if (e.key === "Escape" && isSelectOpen) toggleSelect(false);
    });

// Защита от потери фокуса
    $select.on("mousedown", function (e) {
        e.preventDefault();
    });

    $('#form').on('submit', function (e) {
        e.preventDefault();

        let isValid = true;
        const $orderInput = $('.form-input')

        $orderInput.each(function (element) {
            const curVal = $(this).val().trim();
            const errorMessage = $(this).next()
            if (curVal === '') {
                isValid = false;
                errorMessage.show();
                $(this).css('borderColor', 'red')
            } else {
                errorMessage.hide();
                $(this).css('borderColor', '#ffffff')
            }

            $(this).on('input', function () {
                errorMessage.hide();
                $(this).css('borderColor', '#ffffff')
            });
        })

        if ($selectCurrent.text().trim() !== '' && $selectCurrent.text().trim() !== 'Выберите время') {
            $errorMessageSelect.hide();
            $select.css('borderColor', '#ffffff')
        } else {
            isValid = false;
            $errorMessageSelect.show();
            $select.css('borderColor', 'red')
        }

        let userData = {
            name: $('#name').val(),
            phone: $('#phone').val(),
            time: $('#time').text()
        }

        if (isValid) {
            $.ajax({
                url: 'https://testologia.ru/checkout',
                method: 'POST',
                dataType: 'json',
                data: userData,
                success: function (response) {
                    if (response.success === 1) {
                        setTimeout(() => {
                            $('#reservation').show();
                            $('#success__message').css('display', 'none')
                            $('#popup').removeClass('active')
                        }, 8000)
                        $('#reservation').hide();
                        $('#success__message').css('display', 'flex')
                        $('#popup').addClass('active')
                        $('#timeData').text($('#time').text())
                    } else {
                        alert("Возникла ошибка при оформлении заказа, позвоните нам и сделайте заказ")
                        $('#form').reset()
                    }
                },
                error: function (xhr, status, error) {
                    // Действия при возникновении ошибки
                    console.error('Ошибка:', error);
                }
            });
        }
    })
})





