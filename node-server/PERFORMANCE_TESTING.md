# Performance Testing & Load Testing Guide

## Overview

This guide provides instructions for testing the performance of the Node.js server and validating optimization improvements.

---

## 1. Basic Performance Testing

### Test 1: Response Time Measurement

**Single Request Response Time**:

```bash
# Measure time for single request
time curl http://localhost:8001/tasks

# Example output:
# real    0m0.025s
# user    0m0.003s
# sys     0m0.002s
```

**With Cache (Second Request)**:

```bash
# First request (MISS)
time curl http://localhost:8001/tasks

# Second request (HIT) - should be faster
time curl http://localhost:8001/tasks
```

### Test 2: Compare Compression Impact

**Without Compression**:
```bash
curl -w "\nSize: %{size_download} bytes\n" http://localhost:8001/tasks > /dev/null
```

**With Compression**:
```bash
curl -w "\nSize: %{size_download} bytes\n" \
  -H "Accept-Encoding: gzip" \
  http://localhost:8001/tasks > /dev/null
```

**Expected Result**: Compressed response is 60-80% smaller

---

## 2. Load Testing

### Using Apache Bench (ab)

**Installation** (Alpine Linux):
```bash
apk add apache2-utils
```

### Test 2a: Normal Load (100 requests, 10 concurrent)

```bash
ab -n 100 -c 10 http://localhost:8001/tasks
```

**Example Output**:
```
This is ApacheBench, Version 2.3
Document URL:          http://localhost:8001/tasks
Document Length:        181 bytes

Concurrency Level:      10
Time taken for tests:   0.285 seconds
Complete requests:      100
Failed requests:        0
Requests per second:    350.88 [#/sec]
Time per request:       28.50 [ms]
Time per request:       2.85 [ms] (mean, across all concurrent requests)
Transfer rate:          124.31 [Kbytes/sec]

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        1    5   2.5      4      12
Processing:     2   22   5.8     22      35
Waiting:        1   21   5.9     21      34
Total:          4   27   7.0     26      46
```

### Test 2b: Heavy Load (1000 requests, 50 concurrent)

```bash
ab -n 1000 -c 50 http://localhost:8001/tasks
```

### Test 2c: Stress Test (5000 requests, 100 concurrent)

```bash
ab -n 5000 -c 100 http://localhost:8001/tasks
```

### Test 2d: Rate Limiting Test (101 requests to trigger limit)

```bash
ab -n 101 -c 1 http://localhost:8001/tasks
```

**Expected**: Some requests should fail with 429 status

---

## 3. Concurrent POST Requests

### Using Bash Loop

**Add 100 tasks concurrently**:

```bash
#!/bin/bash
# concurrent_post_test.sh

for i in {1..100}; do {
  curl -X POST http://localhost:8001/tasks \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"Concurrent task $i\"}" &
}; done
wait
echo "All requests completed"

# Run it
chmod +x concurrent_post_test.sh
./concurrent_post_test.sh
```

### Using GNU Parallel

```bash
apk add parallel

# Send 100 POST requests in parallel (10 at a time)
seq 1 100 | parallel -j 10 \
  'curl -s -X POST http://localhost:8001/tasks \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"Parallel task {}\"}"'
```

---

## 4. Cache Effectiveness Testing

### Test 4a: Measure Cache Hit Rate

```bash
#!/bin/bash
# cache_test.sh

echo "Testing cache effectiveness..."

# Make 20 requests to the same endpoint
for i in {1..20}; do
  RESPONSE=$(curl -s -i http://localhost:8001/tasks)
  CACHE_STATUS=$(echo "$RESPONSE" | grep "X-Cache" | cut -d' ' -f2)
  echo "Request $i: $CACHE_STATUS"
done

# Expected: First request MISS, next 19 requests HIT
```

### Test 4b: Cache Invalidation Test

```bash
#!/bin/bash
# cache_invalidation_test.sh

echo "Testing cache invalidation..."

# Request 1: MISS
echo "Request 1 (should be MISS):"
curl -s -i http://localhost:8001/tasks | grep "X-Cache"

# Request 2: HIT
echo "Request 2 (should be HIT):"
curl -s -i http://localhost:8001/tasks | grep "X-Cache"

# Add a task (invalidates cache)
echo "Adding task (invalidates cache)..."
curl -s -X POST http://localhost:8001/tasks \
  -H "Content-Type: application/json" \
  -d '{"text":"Cache test task"}'

# Request 3: MISS (cache cleared)
echo "Request 3 (should be MISS):"
curl -s -i http://localhost:8001/tasks | grep "X-Cache"

# Request 4: HIT
echo "Request 4 (should be HIT):"
curl -s -i http://localhost:8001/tasks | grep "X-Cache"
```

---

## 5. Using wrk for Advanced Load Testing

### Installation

```bash
# Clone wrk
git clone https://github.com/wg/wrk.git
cd wrk
make
sudo cp wrk /usr/local/bin/
```

### Basic Load Test

```bash
# 4 threads, 100 connections, 30 second duration
wrk -t4 -c100 -d30s http://localhost:8001/tasks
```

**Example Output**:
```
Running 30s test @ http://localhost:8001/tasks
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    28.30ms    8.50ms 156.20ms   85.50%
    Req/Sec   882.50    112.30     1.00k    78.50%
  105,629 requests in 30.01s, 19.12MB read
Requests/sec:   3521.22
Transfer/sec:   654.18KB
```

### Load Test with POST Requests

**Create a Lua script** (`post_test.lua`):
```lua
request = function()
  wrk.body = '{"text":"Load test task"}'
  wrk.headers["Content-Type"] = "application/json"
  return wrk.format("POST", "/tasks")
end
```

**Run the test**:
```bash
wrk -t4 -c100 -d30s -s post_test.lua http://localhost:8001
```

---

## 6. Memory Usage Testing

### Monitor Memory During Load

**Terminal 1 - Start monitoring**:
```bash
# Watch memory usage
watch -n 1 'ps aux | grep node'
```

**Terminal 2 - Generate load**:
```bash
# Run load test
ab -n 10000 -c 100 http://localhost:8001/tasks
```

### Using Node Inspector

```bash
# Start server with inspector
node --inspect src/index.js

# Open Chrome DevTools
# chrome://inspect

# Monitor memory in Memory tab
```

---

## 7. Database Query Performance (Future)

When integrating with a database:

```bash
# Test with database reads
ab -n 1000 -c 50 http://localhost:8001/tasks

# Test with database writes
parallel -j 50 'curl -X POST http://localhost:8001/tasks \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Test {}\"}"' ::: {1..1000}
```

---

## 8. Performance Metrics Analysis

### Analyze Metrics Endpoint

```bash
#!/bin/bash
# analyze_metrics.sh

# Get current metrics
METRICS=$(curl -s http://localhost:8001/metrics)

# Extract specific values
echo "=== Performance Metrics ==="
echo "$METRICS" | grep -o '"requestCount":[0-9]*'
echo "$METRICS" | grep -o '"errorCount":[0-9]*'
echo "$METRICS" | grep -o '"cacheHits":[0-9]*'
echo "$METRICS" | grep -o '"hitRate":"[^"]*'
```

### Performance Baseline Comparison

**First run (baseline)**:
```bash
# Get metrics before load test
curl http://localhost:8001/metrics > metrics_before.json

# Run load test
ab -n 1000 -c 50 http://localhost:8001/tasks > load_test_1.txt

# Get metrics after load test
curl http://localhost:8001/metrics > metrics_after.json

# Compare
echo "Before: $(cat metrics_before.json | grep hitRate)"
echo "After: $(cat metrics_after.json | grep hitRate)"
```

---

## 9. Expected Performance Results

### Single Request Baseline
- **First request (MISS)**: ~5-10ms
- **Subsequent request (HIT)**: ~0.5-1ms
- **Response size (compressed)**: ~100-150 bytes
- **Response size (uncompressed)**: ~500 bytes

### Load Test Results (1000 requests, 50 concurrent)
- **Requests/sec**: ~3000-5000
- **Average latency**: ~15-30ms
- **Max latency**: <200ms
- **Error rate**: <1%
- **Throughput**: >2MB/s

### Cache Performance
- **Hit rate after warm-up**: >80%
- **Time improvement (HIT vs MISS)**: 5-10x faster
- **Cache memory usage**: <1MB

---

## 10. Troubleshooting Performance Issues

### Issue: High Response Times

**Diagnosis**:
```bash
# Check error rate
curl http://localhost:8001/metrics | grep errorCount

# Check cache hit rate
curl http://localhost:8001/metrics | grep hitRate
```

**Solutions**:
1. Increase cache TTL if hit rate is low
2. Check for synchronous operations
3. Verify database connections (if using DB)
4. Check server CPU/memory usage

### Issue: 429 Rate Limit Errors

**Diagnosis**:
```bash
# Check request count
curl http://localhost:8001/metrics | grep requestCount
```

**Solutions**:
1. Reduce concurrent connections
2. Increase rate limit if legitimate traffic
3. Implement client-side request throttling

### Issue: Memory Usage Growing

**Diagnosis**:
```bash
# Check for memory leaks
node --inspect src/index.js
# Use Chrome DevTools Memory profiler
```

**Solutions**:
1. Clear cache if too large
2. Check for unhandled promises
3. Verify database connection pooling

---

## 11. Automation Script

**Complete test suite** (`run_performance_tests.sh`):

```bash
#!/bin/bash
# run_performance_tests.sh

set -e

SERVER="http://localhost:8001"
RESULTS_DIR="performance_results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$RESULTS_DIR"

echo "=== Starting Performance Tests ==="
echo "Time: $TIMESTAMP"
echo ""

# Test 1: Single request baseline
echo "Test 1: Single request baseline"
for i in {1..5}; do
  time curl -s "$SERVER/tasks" > /dev/null
done

# Test 2: Load test
echo ""
echo "Test 2: Load test (100 req, 10 concurrent)"
ab -n 100 -c 10 "$SERVER/tasks" | tee "$RESULTS_DIR/load_test_$TIMESTAMP.txt"

# Test 3: Cache effectiveness
echo ""
echo "Test 3: Cache effectiveness"
bash cache_test.sh | tee "$RESULTS_DIR/cache_test_$TIMESTAMP.txt"

# Test 4: Metrics
echo ""
echo "Test 4: Metrics"
curl -s "$SERVER/metrics" | jq . | tee "$RESULTS_DIR/metrics_$TIMESTAMP.json"

echo ""
echo "=== Tests Complete ==="
echo "Results saved to $RESULTS_DIR/"
```

**Run it**:
```bash
chmod +x run_performance_tests.sh
./run_performance_tests.sh
```

---

## Summary

### Key Performance Indicators
- ✅ Response time: <10ms (MISS), <1ms (HIT)
- ✅ Cache hit rate: >80% after warmup
- ✅ Throughput: >3000 req/s
- ✅ Error rate: <1%
- ✅ Compression: 60-80% reduction
- ✅ Memory: <50MB stable

### Optimization Impact
- **Compression**: 60-80% bandwidth reduction
- **Caching**: 5-10x faster for cached requests
- **Rate limiting**: Prevents abuse
- **Concurrency**: Handles 100+ concurrent requests

---

**Last Updated**: January 15, 2026
