import sweetalert from 'sweetalert';
import {resolve} from 'path';

export default {
    text(message) {
        swal(message);
    },
    message(title, message) {
        swal(title, message);
    },
    success(title, message) {
        swal(title, message, "success");
    },
    error(title, message) {
        swal(title, message, "error");
    },
    warning(title, message) {
        swal(title, message, "warning");
    },
    info(title, message) {
        swal(title, message, "info");
    },
    confirm(title, message) {
        var p = new Promise((resolve, reject) => 
        {
            swal({
                title: title,
                text: message,
                icon: "warning",
                buttons: ['取消','确定'],
                dangerMode: true
              }).then(istrue => {
                if (istrue) {
                    resolve();
                }
              });
        });
        return p;
    },
    alert(title, message) {
        var p = new Promise((resolve, reject) => 
        {
            swal({
                title: title,
                text: message,
                icon: "warning",
                buttons:'确定',
                closeOnClickOutside: false,
                closeOnEsc: false,
                dangerMode: true
              }).then(istrue => {
                if (istrue) {
                    resolve();
                }
              });
        });
        return p;
    }
}