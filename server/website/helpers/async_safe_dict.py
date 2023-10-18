import asyncio


class AsyncSafeDict:
    def __init__(self):
        self._dict = {}
        self._lock = asyncio.Lock()

    async def keys(self):
        async with self._lock:
            return self._dict.keys()

    async def contains(self, item):
        async with self._lock:
            return item in self._dict

    async def get(self, key):
        async with self._lock:
            return self._dict.get(key)

    async def set(self, key, value):
        async with self._lock:
            self._dict[key] = value

    async def take(self, key):
        async with self._lock:
            if key in self._dict:
                result = self._dict[key]
                del self._dict[key]

                return result

    async def delete(self, key):
        async with self._lock:
            if key in self._dict:
                del self._dict[key]
