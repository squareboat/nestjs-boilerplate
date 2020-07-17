# NestJS Boilerplate

A production 🏭 ready NestJS boilerplate with batteries 🔋 included. No Kidding!

## Table of Content

- [NestJS Boilerplate](#nestjs-boilerplate)
  - [Table of Content](#table-of-content)
  - [Introduction](#introduction)
  - [Getting Started](#getting-started)
  - [NPM Commands](#npm-commands)
  - [Batteries](#batteries)
    - [Request Helpers](#request-helpers)
    - [Response Helpers](#response-helpers)
    - [Controllers](#controllers)
    - [Exception Handling](#exception-handling)
    - [Helpers](#helpers)
    - [Repositories](#repositories)
    - [Transformers](#transformers)
    - [Validators](#validators)
  - [Contributing](#contributing)
  - [About Us](#about-us)
  - [License](#license)

## Introduction

We started working with NestJS few months back, we were blown away with the functionalities that it provides 🙇🙌. But for our use case we needed something more than just basic functionalities, that is when our team started working 🧑‍💻 on a boilerplate, which can be used for any project.

This boilerplate helps avoid the redundancy cycle each developer has to go through, it handles most of the repetitive 🔁 and tedious ⏲️ tasks, that (imma be honest 🤷) nobody likes.

## Getting Started

If you using Github GUI 🖥️ to initiate your project, consider following [this github doc.](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template)

Github CLI 🔮 users, focus here:

```python
# head to your workspace
1. cd to/your/favourite/directory/on/the/system

# clone the template
2. git clone https://github.com/squareboat/nestjs-boilerplate your-project

# go to the directory where the clone happened
3. cd your-project

# let's set some environment variables
4. cp .env.example .env
5. vi/nano .env

# now, let's install the dependencies
6. npm install

# start the server in watch mode
7. npm run start:dev

# Boom 💥 and it is done!
```

**Optional Step:** When you cloned the repo, the git commit history also got cloned, to clean/erase the history 📜 and init your own repo, follow the following steps:

```python
# remove the .git directory from the project folder
1. rm -rf .git

# initialize a new repo on the same content
2. git init

# add the content to stage
3. git add .

# do your first commit
4. git commit -m  '🚀 INITIAL COMMIT'

# add origin url
5. git remote add origin git@github.com:<YOUR ACCOUNT>/<YOUR REPOS>.git

# do your firt push
6. git push -u origin master
```

## NPM Commands

This boilerplate contains following npm commands (apart from NestJS' one) to support you from the day one of your sprint. Yeah! We love to help 🙋🙏

```python
# Create a new db migration
npm run migration:create

# Runs all the pending migrations 😎
npm run migration:up

# Helps revert the db changes when you need to 😉
npm run migration:down
```

## Batteries

We have added some small and big batteries 🔋 to achieve the stage where a developer don't have to worry about such things ❤️.

### Request Helpers

1. `all()`: Method to get the incoming parameters, all at once. No need to get `body`, `queryParams`, and `params` seperately every time.

```javascript
const inputs = req.all();
```

### Response Helpers

We have our own very generous set of api guidelines, we used our learning of multiple projects to provide structural consistency of response object (which is often unknowningly abused).

- `success(data: Record<string, any>, status=200)`: Returns the success response, use this whenever your request is succesfull, usually for GET and POST requests.

```javascript
/**
 * {
 *  success: true,
 *  code: 200,
 *  data: { message: "Hello There" }
 * };
 **/
return res.success({ message: 'Hello there!' });
```

- `error(error: Record<string, any> | string, status = 401)`: Returns the error response, used in exception filter.

```javascript
/**
 * {
 *  success: false,
 *  code: 401,
 *  message: 'Unauthorized'
 * };
 **/
return res.error('Unauthorized!');
```

-- `noContent()`: There are cases when we need to send only a success status code and no body. `noContent()` will come in handy for you.

```javascript
// will return a response with status code of 204
return res.noContent();
```

-- `withMeta(data: Record<string, any>, status = 200)`: There can be some case where we need to send some payload to support our requested data. For example, pagination information incase of a paginated response. `withMeta` helps you achieve the same.

```javascript
/**
 * {
 *  success: true,
 *  code: 200,
 *  data:[{},{},{}]
 *  meta: {
 *    pagination: {
 *      totalPages: 10,
 *      currentPage: 2,
 *    },
 *    ...some other custom attributes
 *  }
 * };
 **/
return res.withMeta({
  data: [{}, {}],
  pagination: { totalPages: 10, currentPage: 2 },
});
```

### Controllers

🚧 Soon to be updated! 🚧

### Exception Handling

🚧 Soon to be updated! 🚧

### Helpers

🚧 Soon to be updated! 🚧

### Repositories

🚧 Soon to be updated! 🚧

### Transformers

🚧 Soon to be updated! 🚧

### Validators

🚧 Soon to be updated! 🚧

## Contributing

🚧 Soon to be updated! 🚧

## About Us

We are a bunch of dreamers, designers, and futurists. We are high on collaboration, low on ego, and take our happy hours seriously. We'd love to hear more about your product. Let's talk and turn your great ideas into something even greater! We have something in store for everyone. [☎️ 📧 Connect with us!](https://squareboat.com/contact)

## License

The MIT License. Please see License File for more information. Copyright © 2020 SquareBoat.

Made with ❤️ by [Squareboat](https://squareboat.com)
