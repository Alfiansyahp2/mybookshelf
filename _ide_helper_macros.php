<?php

namespace Illuminate\Contracts\Routing {
    interface ResponseFactory {
        /**
         * Return a success JSON response.
         *
         * @param mixed $data
         * @param string $message
         * @param int $statusCode
         * @return \Illuminate\Http\JsonResponse
         */
        public function success($data = null, $message = 'Success', $statusCode = 200);

        /**
         * Return an error JSON response.
         *
         * @param string $message
         * @param mixed $errors
         * @param int $statusCode
         * @return \Illuminate\Http\JsonResponse
         */
        public function error($message = 'Error', $errors = null, $statusCode = 400);
    }
}

namespace Illuminate\Contracts\Auth {
    interface Factory {
        /**
         * Get the ID for the currently authenticated user.
         *
         * @return int|string|null
         */
        public function id();
    }

    /**
     * @property int|string|null $id
     */
    interface Authenticatable {}
}
