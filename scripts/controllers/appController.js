import toastr from 'toastr';
import { appModel } from 'appModel';
import { userModel } from 'userModel';
import { templates } from 'templates';
import { userController } from 'userController';

let appController = (function () {
    class AppController {
        constructor(templates, appModel) {
            this.templates = templates;
            this.appModel = appModel;
        }

        getHomePage(selector) {
            $(selector).empty();
            this.templates.getTemplate('load-home-page').then((responseTemplate) => {
                selector.html(responseTemplate());
            });
        }


        getGallery(selector) {
            $(selector).empty();
            let result;
            this.appModel.getAllPaintings().then((items) => {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));
            }).catch(function (error) {
                toastr.error('Unable to display gallery!');
                location.hash = '#/home';
                console.log(error);
            });
        }

        getPaintingById(selector, id) {
            $(selector).empty();
            let result;
            let resultComments;
            let self = this;
            this.appModel.getPaintingsInfo(id).then((item) => {
                    result = item.data();
                    return templates.getTemplate('paintings-info');
                }).then(function (template) {
                    selector.html(template(result));
                    let user = localStorage.getItem('email');
                    if(user){
                        $('#textarea-comment').removeClass('hidden');
                        $('#add-comment').removeClass('hidden');
                    } else {
                        $('#textarea-comment').addClass('hidden');
                        $('#add-comment').addClass('hidden');
                    }

    //                 $('.like').on('click', function () {
    //                     self.appModel.rateLikes(result)
    //                         .then(function (data) {
    //                             return self.galleryModel.getLikes(data.paintingId);
    //                         }).then(function (array) {
    //                             $('.likes').text(array.length);
    //                             $('.rate-like').removeClass('hidden');
    //                             $('.like').attr('disabled', true);
    //                         });
    //                 });

    //                 $('.dislike').on('click', function () {
    //                     self.appModel.rateDislikes(result)
    //                         .then(function (data) {
    //                             return self.galleryModel.getDislikes(data.paintingId);
    //                         }).then(function (array) {
    //                             $('.dislikes').text(array.length);
    //                             $('.rate-dislike').removeClass('hidden');
    //                             $('.dislike').attr('disabled', true);
    //                         });
    //                 });

    //                 $('.download').on('click', function () {
    //                     self.appModel.downloadPainting(result.image._id)
    //                         .then(downloadWithSuccess)
    //                         .catch(function (error) {
    //                             toastr.error('Unable to download painting!');
    //                         });
    //                     });
                    // $('.comment').on('click', function () {
                        // $('#comments-container').toggleClass('hidden');
                        //     return templates.getTemplate('comments');
                        // }).then(function (template) {
                        //     $('#comments-container').html(template(result));

                            $('#add-comment').on('click', function (ev) {
                                let content = {
                                    date: moment().format("ll"),
                                    text: $('#textarea-comment').val(),
                                    user: user,
                                };
                                
                                if (content.text === "") {
                                    toastr.error("You have not write a comment!");
                                    ev.preventDefault();
                                    return;
                                }
                                self.appModel.addNewComment(content, id).then(function (data) {
                                    toastr.success('Comment was added');
                                }).catch(function (error) {
                                    console.log(error);
                                    toastr.error('Try again');
                                });

                                self.appModel.getPaintingsInfo(result.id).then(function (data) {
                                    resultComments = {
                                        comments: data
                                    };
                                    return templates.getTemplate('comments');
                                }).then(function (template) {
                                    $('#comments-container').html(template(resultComments));
                                });
                            });
                        // });
                    //});
    //           })
    //             .then(() => {
    //                 $('.buy').on('click', () => this.addToCart(result));
    //                 if (userController.shoppingCartManager.isAdded(id)) {
    //                     $('.buy').attr('disabled', true);
    //                 } else {
    //                     $('.buy').attr('disabled', false);
    //                 }
                })
                .catch(function (error) {
                    toastr.error('Unable to display painting!');
                    console.log(error);
                    location.hash = '#/paintings';
                });
        }

        getPaintingByArtist(selector, artist) {
            $(selector).empty();
            let result;
            this.appModel.getArtistsInfo(artist).then((item) => {
                let artist = item.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    artist
                };
                return templates.getTemplate('artist-info');
            }).then(function (template) {
                selector.html(template(result));
            }).catch(function (error) {
                console.log(error);
                toastr.error('Unable to display painting!');
                location.hash = '#/paintings';
            });
        }

    //     addToCart(paintingData) {
    //         let newItmensCount = userController.shoppingCartManager.shoppingItemsCountElement.text(),
    //             cartCountElement = userController.shoppingCartManager.shoppingItemsCountElement;
    //         newItmensCount++;
    //         cartCountElement.text(newItmensCount);
    //         userController.shoppingCartManager.items.push({
    //             id: paintingData._id,
    //             image: paintingData.image,
    //             title: paintingData.title,
    //             author: paintingData.artist.name,
    //             price: paintingData.price
    //         });
    //         $('.buy').attr('disabled', true);
    //     }

        getPaintingsByStyle(selector, style) {
            $(selector).empty();
            let result;
            this.appModel.getPaintingsInfoByStyle(style).then((items) => {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));
            }).catch(function (error) {
                toastr.error('Unable to display paintings!');
                location.hash = '#/paintings';
            });
        }

        getPaintingsBySubject(selector, subject) {
            $(selector).empty();
            let result;
            this.appModel.getPaintingsInfoBySubject(subject).then((items) => {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));
            }).catch(function (error) {
                toastr.error('Unable to display paintings!');
                location.hash = '#/paintings';
            });
        }

        getPaintingsByTechnique(selector, technique) {
            $(selector).empty();
            let result;
            this.appModel.getPaintingsInfoByTechnique(technique).then((items) => {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));
            }).catch(function (error) {
                toastr.error('Unable to display paintings!');
                location.hash = '#/paintings';
            });
        }

        searchByTitle(selector, title) {
            $(selector).empty();
            let result;
            this.appModel.getPaintingsByTitle(title).then(function (items) {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));

            }).catch(function (error) {
                toastr.error('Unable to display painting!');
                location.hash = '#/paintings';
            });
        }

        searchByArtist(selector, artist) {
            $(selector).empty();
            let result;
            this.appModel.getPaintingsByArtist(artist).then(function (items) {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));

            }).catch(function (error) {
                toastr.error('Unable to display painting!');
                location.hash = '#/paintings';
            });
        }
    }

    // function downloadWithSuccess(data) {
    //     let url = data._downloadURL;
    //     let link = document.createElement('a');
    //     link.download = url.substr(url.lastIndexOf('/'));
    //     link.href = url;
    //     link.click();
    // }

    return new AppController(templates, appModel);
})();

export { appController };