// module.exports = {
//     babel: {
//         plugins: [require.resolve('babel-plugin-react-compiler')],
//     },
// };

<<<<<<< HEAD
// module.exports = {
//     babel: {
//         plugins: [
//             [
//                 require.resolve('babel-plugin-react-compiler'),
//                 {
//                     // useNavigate를 사용하는 컴포넌트들을 제외
//                     compilationMode: 'annotation', // 또는 아래 방법
//                 },
//             ],
//         ],
//     },
// };
=======
module.exports = {
    babel: {
        plugins: [
            [
                require.resolve('babel-plugin-react-compiler'),
                {
                    // useNavigate를 사용하는 컴포넌트들을 제외
                    compilationMode: 'annotation', // 또는 아래 방법
                },
            ],
        ],
    },
};
>>>>>>> origin/Chae-A
