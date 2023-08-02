import {faker} from '@faker-js/faker';
faker.seed(123);
export function generateRandomPosts(count:number){
    const posts = [];
    const visibility = ['public', 'friends', 'private'];
    const conditions = ['sunny', 'rainy', 'cloudy', 'snowy'];
    const usernames = ['anhquang2605','chuquang2605'];
    for(let i = 0; i < count; i++){
        let randomNumber = faker.number.int({min: 0, max: 3});
        let taggedUsernames = [];
        for (let j = 0; j < randomNumber; j++){
            taggedUsernames.push(faker.internet.userName());
        }
        posts.push({
            _id: faker.string.uuid(),  
            content: faker.lorem.paragraph(),
            username: usernames[faker.number.int({min: 0, max: 1})],
            createdDate: faker.date.past(),
            updatedDate: faker.date.past(),
            pictureAttached: true,
            taggedUsernames: taggedUsernames,
            visibility: visibility[faker.number.int({min: 0, max: 2})],
            weatherVibe: {
                enabled: faker.datatype.boolean(),
                caption: faker.lorem.sentence({max: 6, min: 4}),
                weatherData: {
                    condition: conditions[faker.number.int({min: 0, max: 3})],
                    temperature: faker.number.int({min: 0, max: 100}),
                    location: faker.location.city()
                }
            }  
        })   
    }
    return posts;
}

export function generateRandomComments(count:number){

}

export function generateRandomPicturesForPost(count:number){
    const pictures = [];
    for(let i = 0; i < count; i++){
        pictures.push({
            _id: faker.string.uuid(),
            title: faker.lorem.sentence(),
            picturePath: faker.image.url(),
            createdDate: faker.date.past(),
            targetId: faker.string.uuid(),
            username: faker.internet.userName(),
            description: faker.lorem.paragraph()
        })
    }
    return pictures;
}