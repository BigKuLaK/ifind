echo "/=============================/" && \
echo "/==== INSTALLING PACKAGES ====/" && \
npm install && \

echo "/=============================/" && \
echo "/==== RUNNING TESTS ====/" && \
CI=true npm run test -- --coverage && \

echo "/=============================/" && \
echo "/==== BUILDING SITE ====/" && \
CI=true npm run build