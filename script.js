// Project detail dialogs
(function () {
    'use strict';

    var lastTrigger = null;
    var nativeDialog = typeof HTMLDialogElement === 'function' &&
        typeof HTMLDialogElement.prototype.showModal === 'function';

    function openDialog(dialog, trigger) {
        if (!dialog || dialog.open) return;
        lastTrigger = trigger || null;
        if (nativeDialog) {
            dialog.showModal();
        } else {
            dialog.setAttribute('open', '');
        }
        document.body.classList.add('modal-open');
        var closeBtn = dialog.querySelector('.close-dialog');
        if (closeBtn) closeBtn.focus();
    }

    function closeDialog(dialog) {
        if (!dialog || !dialog.open) return;
        if (nativeDialog) {
            dialog.close();
        } else {
            dialog.removeAttribute('open');
            onClosed();
        }
    }

    function onClosed() {
        document.body.classList.remove('modal-open');
        if (lastTrigger) {
            lastTrigger.focus();
            lastTrigger = null;
        }
    }

    document.querySelectorAll('.project-open[data-dialog]').forEach(function (trigger) {
        function activate() {
            openDialog(document.getElementById(trigger.getAttribute('data-dialog')), trigger);
        }
        trigger.addEventListener('click', activate);
        // The card is a focusable role="button", so mirror native button keys.
        trigger.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activate();
            }
        });
    });

    document.querySelectorAll('dialog.project-dialog').forEach(function (dialog) {
        dialog.querySelectorAll('.close-dialog').forEach(function (btn) {
            btn.addEventListener('click', function () { closeDialog(dialog); });
        });

        // Backdrop click: the click target is the <dialog> itself, outside its content box.
        dialog.addEventListener('click', function (event) {
            if (event.target !== dialog) return;
            var r = dialog.getBoundingClientRect();
            var inside = event.clientX >= r.left && event.clientX <= r.right &&
                         event.clientY >= r.top && event.clientY <= r.bottom;
            if (!inside) closeDialog(dialog);
        });

        // Esc is handled natively by showModal(); this covers the no-<dialog> fallback.
        dialog.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !nativeDialog) {
                event.preventDefault();
                closeDialog(dialog);
            }
        });

        dialog.addEventListener('close', onClosed);
    });
})();
